# StartStopScript — Sparecare OGYS FRD

Windows batch scripts that bring the OGYS FRD site up on Vercel and take it back down.
Each run writes a timestamped log to [logs/](logs/).

| | |
|---|---|
| **Live URL** | https://ogys-html-vercel.vercel.app |
| **Vercel project** | `ogys-html-vercel` (team `saurabh-kumar-vermas-projects`) |
| **Entry document** | `index.html` (served at `/`) |
| **Deployed folder** | the parent of this folder |

## Usage

```bat
start-vercel.bat            :: deploy to Vercel production (default)
start-vercel.bat local      :: local dev server on http://localhost:3000

stop-vercel.bat             :: remove the production project (asks you to type YES)
stop-vercel.bat prod -y     :: remove without the prompt
stop-vercel.bat local       :: stop the local dev server on port 3000
```

Start checks that `index.html` and the linked sections (FRD, visuals, workflows, downloads)
exist before deploying, then confirms the site answers HTTP 200.

Stop removes the project and all deployments, so the URL returns 404. Running
`start-vercel.bat` afterwards re-creates the project under the same name, so the same URL returns.

## Token and upload exclusions

Both scripts read `VERCEL_TOKEN` from `..\.env`, pass it as an environment variable (never on the
command line), and log only its first six characters. `..\.vercelignore` keeps `.env`,
`StartStopScript/` and `logs/` out of the deployment.

## Notes

- Line endings must stay CRLF. If the files are re-saved with LF endings, `cmd.exe` fails
  with "The system cannot find the batch label specified".
- The scripts link the folder to the Vercel project automatically if `..\.vercel\project.json`
  is missing.
