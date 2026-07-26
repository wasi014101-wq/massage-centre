"""
Deploy website to Netlify using their API.
Creates a new site and deploys all files.
"""
import os
import hashlib
import requests
import json
import sys

SITE_DIR = r"c:\Users\umeed\OneDrive\Desktop\website"
NETLIFY_API = "https://api.netlify.com/api/v1"

def get_file_sha1(filepath):
    """Calculate SHA1 hash of a file."""
    sha1 = hashlib.sha1()
    with open(filepath, 'rb') as f:
        while True:
            data = f.read(65536)
            if not data:
                break
            sha1.update(data)
    return sha1.hexdigest()

def collect_files(site_dir):
    """Collect all files and their SHA1 hashes."""
    files = {}
    for root, dirs, filenames in os.walk(site_dir):
        # Skip hidden directories and deploy script
        dirs[:] = [d for d in dirs if not d.startswith('.')]
        for fname in filenames:
            if fname == 'deploy.py':
                continue
            filepath = os.path.join(root, fname)
            relpath = '/' + os.path.relpath(filepath, site_dir).replace('\\', '/')
            sha1 = get_file_sha1(filepath)
            files[relpath] = {'sha1': sha1, 'filepath': filepath}
    return files

def deploy(token):
    """Deploy website to Netlify."""
    print("📦 Collecting files...")
    files = collect_files(SITE_DIR)
    
    # Build the file digest
    file_digests = {path: info['sha1'] for path, info in files.items()}
    
    print(f"   Found {len(files)} files")
    for path in sorted(files.keys()):
        print(f"   • {path}")
    
    # Step 1: Create a new site with deploy
    print("\n🚀 Creating site on Netlify...")
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    
    # Create site
    resp = requests.post(f"{NETLIFY_API}/sites", headers=headers, json={})
    if resp.status_code not in (200, 201):
        print(f"❌ Failed to create site: {resp.status_code} {resp.text}")
        return
    
    site = resp.json()
    site_id = site['id']
    site_url = site.get('ssl_url') or site.get('url')
    site_name = site.get('name', '')
    print(f"   Site created: {site_name}")
    
    # Step 2: Create deploy with file digests
    print("\n📤 Initiating deploy...")
    deploy_data = {
        'files': file_digests
    }
    
    resp = requests.post(
        f"{NETLIFY_API}/sites/{site_id}/deploys",
        headers=headers,
        json=deploy_data
    )
    
    if resp.status_code not in (200, 201):
        print(f"❌ Failed to create deploy: {resp.status_code} {resp.text}")
        return
    
    deploy_info = resp.json()
    deploy_id = deploy_info['id']
    required_files = deploy_info.get('required', [])
    
    print(f"   Deploy ID: {deploy_id}")
    print(f"   Files to upload: {len(required_files)}")
    
    # Step 3: Upload required files
    if required_files:
        print("\n⬆️  Uploading files...")
        upload_headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/octet-stream'
        }
        
        # Map SHA1 back to file paths
        sha_to_paths = {}
        for path, info in files.items():
            if info['sha1'] not in sha_to_paths:
                sha_to_paths[info['sha1']] = []
            sha_to_paths[info['sha1']].append((path, info['filepath']))
        
        uploaded = 0
        for sha1 in required_files:
            if sha1 in sha_to_paths:
                for rel_path, abs_path in sha_to_paths[sha1]:
                    with open(abs_path, 'rb') as f:
                        file_data = f.read()
                    
                    resp = requests.put(
                        f"{NETLIFY_API}/deploys/{deploy_id}/files{rel_path}",
                        headers=upload_headers,
                        data=file_data
                    )
                    
                    if resp.status_code in (200, 201):
                        uploaded += 1
                        print(f"   ✅ {rel_path} ({len(file_data):,} bytes)")
                    else:
                        print(f"   ❌ {rel_path}: {resp.status_code}")
        
        print(f"\n   Uploaded {uploaded} files")
    
    # Step 4: Get final deploy info
    print("\n⏳ Finalizing deploy...")
    resp = requests.get(
        f"{NETLIFY_API}/deploys/{deploy_id}",
        headers={'Authorization': f'Bearer {token}'}
    )
    
    if resp.status_code == 200:
        final = resp.json()
        state = final.get('state', 'unknown')
        ssl_url = final.get('ssl_url', '')
        deploy_url = final.get('deploy_ssl_url', ssl_url)
        
        print(f"\n{'='*60}")
        print(f"✅ DEPLOYMENT SUCCESSFUL!")
        print(f"{'='*60}")
        print(f"🌐 Your permanent URL: {ssl_url}")
        print(f"📱 Open on any device, anywhere in the world!")
        print(f"📊 Manage at: https://app.netlify.com/sites/{site_name}")
        print(f"{'='*60}")
    else:
        print(f"   Status check failed: {resp.status_code}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python deploy.py <netlify_personal_access_token>")
        print("\nTo get a token:")
        print("1. Go to https://app.netlify.com/user/applications#personal-access-tokens")
        print("2. Click 'New access token'")
        print("3. Name it anything (e.g., 'website-deploy')")
        print("4. Copy the token and run: python deploy.py YOUR_TOKEN")
        sys.exit(1)
    
    token = sys.argv[1]
    deploy(token)
