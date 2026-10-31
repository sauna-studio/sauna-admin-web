# ローカル検証記録 — 2026-11-01

Bun 1.4.4で実行。GitHub ActionsではなくローカルmacOSの検証。

- `bun install --frozen-lockfile`: 成功。lockfile変更なし。
- `bun run check`: 成功、0 errors / 0 warnings。
- `bun run lint`: Prettier / ESLintとも成功。
- `bun run test:unit`: 2 files / 19 tests成功。Bun runtime、人数整数1–12、不正入力、固定API接続先、公開レスポンス投影、非string version拒否を検証。
- `bun run test:e2e`: production buildとofficial Bun adapterでの起動を含め、desktop Chromium / モバイル幅Chromiumで計6 tests成功。
- `git diff --check`: 成功。

独立Review Agentによる指摘: `/version`の配列値がRegExpの文字列coercionで受容される問題を修正。両fieldのtypeof guardとarray/null/number/objectの回帰テストを追加した。顧客画面の入力競合対応はsauna-web側の検証記録を参照。本管理者shellにはフォーム入力・認証・管理機能を配置していない。

`bun run api:smoke`も成功。Apple container上で稼働するSauna APIへ固定127.0.0.1:8080経由で実接続し、health status=ok / apiVersion=1.0.0 / version=0.1.0を確認した。UIはこの診断に依存せず、内部診断を表示しない。Safari MCP未接続、Safari/iOS実機、外部API認可、遠隔CI、デプロイは未検証。

独立Review Agentの最終再検証もcheck / lint / unit19 / production build / E2E6 / api:smoke / diffcheckすべて成功。非string version拒否をBun直接呼出でも再現確認し、顧客の入力巻戻り修正も再確認した。未解決blocking指摘なし。GitHub上のCodexレビューとCIはローカル限定作業のため未依頼・未実行。

Foundation PR preparation: refreshed frozen install, type check (0 errors/warnings), lint, unit 19 and production build successfully. Added read-only, SHA-pinned Bun CI for these checks and the existing public-shell Playwright tests. PR creation is now authorized by the latest user instruction; remote CI results are pending until they actually run.

## Passkey staff UI and BFF

Added `/auth` (login/logout only; no anonymous staff enrollment), generated OpenAPI client and a fixed seven-path local BFF. Exact `http://localhost:5174` Origin and Fetch Metadata are required; only staff flow/session cookies and CSRF are forwarded to fixed `127.0.0.1:8080`. Redirects are rejected, body reads are bounded at 128 KiB, and one 10-second deadline covers request read, fetch and response read. Cookies retain Secure/HttpOnly/SameSite=Strict and all responses are no-store. Workspace membership and management permission remain unimplemented and the UI states this explicitly.

Type check (0 errors/warnings), lint, production build, unit tests and existing six public-shell E2E cases passed. Unit regressions cover origin/route restrictions, cookie isolation/duplicates, bounded/cancelled streams, safe errors, native JSON credential APIs and generated client requests. Bun 1.4.4 misreports native Request.credentials='same-origin' as 'include'; tests assert the constructor input without changing browser policy.

Dedicated `bun run test:auth` requires production build and the local API/PostgreSQL. It uses canonical localhost:5174 and verifies signed-out staff UI/enrollment denial, without claiming an authorized staff session. Trace/video/screenshots are off in both configs; no HAR/storage state/private keys are recorded. Safari/iOS, real authenticators and Workspace authorization remain unverified.


Final local auth integration: discovered adapter-bun 1.0 reads build-time `paths.origin`, not adapter-node's runtime `ORIGIN`. Configured the fixed canonical origin in Kit and added a raw Host equality guard, with missing/wrong/duplicate Host regressions. CSRF checks remain enabled. The real Chromium customer resident/UV suite passed three repetitions (registration 204 does not authenticate; assertion required; Secure/HttpOnly/Strict cookie hidden from JS; reload; logout; sign-in again; revoke-all 204 awaited; session then 401). The staff suite passed three repetitions (login UI ready, no enrollment, no Workspace/management authorization claim). Local API uses real PostgreSQL via Apple container. Initial intermittent Chrome GREASE clientData rejection was reproduced using key names only and resolved by the API verifier's W3C-compatible unknown-key handling; no raw values were logged. The source test no longer inspects clientData after diagnosis.

Added synthetic UI regressions for unsupported browsers, cancelled requests, and expiry clearing in-memory session state and prompting sign-in. Existing plus new desktop/mobile Chromium E2E cases total 12 successful per repository. Safari/iOS and real platform authenticators remain unverified. These are local checks; latest GitHub head CI/Codex is still a separate merge gate.
