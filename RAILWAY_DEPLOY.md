# Railway Deployment Instructions

## Option 1: Via Railway Dashboard (Web)

1. Visit: https://railway.com/project/36e7144b-1ec7-85de-8969-21686fb1312f
2. Click on your service
3. Settings → Source → Connect Repo
4. Select: ecxiiii/ipsec
5. Branch: master
6. Deploy automatically triggers

## Option 2: Via Railway CLI

Install Railway CLI:
```bash
npm i -g @railway/cli
```

Login and link:
```bash
railway login
cd "D:\rovic_portfolio\IP Sec Architechture"
railway link 36e7144b-1ec7-45de-8969-21686fb1312f
railway up
```

## Option 3: Manual GitHub Deploy

If Railway GitHub integration isn't working:

1. In Railway service settings
2. Instead of "GitHub Repo", select "GitHub Action" or "Manual Deploy"
3. Use Railway's deploy token in GitHub Actions

## Troubleshooting

### Check Deployment Status
1. Railway Dashboard → Deployments tab
2. Look for green checkmark ✅ or red X ❌
3. Click deployment to view logs

### Common Errors

**Error: "No start command"**
- Add to Variables: `START_COMMAND` = `npx serve -s . -l 3000`

**Error: "Port already in use"**
- Railway auto-assigns PORT variable
- Our serve command uses port 3000

**Error: "Module not found"**
- Railway should auto-install from package.json
- Check Build Logs for npm install errors

### View Live Logs
```bash
railway logs
```

### Force Redeploy
```bash
railway up --detach
```

## Expected Result

After successful deployment:
- URL: `https://[your-service].up.railway.app`
- Status: ✅ Active
- Response: IPsec Architecture Presentation loads

## Still Having Issues?

Share the error message from:
- Railway Deployment Logs
- Railway Build Logs
- Or screenshot of the Railway dashboard
