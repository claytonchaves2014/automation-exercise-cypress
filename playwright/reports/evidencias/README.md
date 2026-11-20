# Evidências dos testes Playwright

Relatórios gerados localmente em 20/11/2026.

| Categoria | Resultado | Evidência |
| --- | --- | --- |
| API | 9 cenários e 63 passos aprovados | [Relatório HTML](01-api/relatorio.html) · [JSON](01-api/relatorio.json) |
| E2E desktop | 6 cenários e 36 passos aprovados | [Relatório HTML](02-e2e/relatorio.html) · [JSON](02-e2e/relatorio.json) · [Capturas](02-e2e/capturas/) |
| CI/CD | Workflow configurado | [Workflow do GitHub Actions](03-ci-cd/playwright.yml) |
| Carga (smoke) | Aprovado: 58 requisições, p95 de 1,01 ms e 100% de verificações | [Relatório HTML](04-carga-opcional/relatorio-carga-k6.html) · [JSON](04-carga-opcional/relatorio-carga-k6.json) · [Saída](04-carga-opcional/execucao.txt) |
| Mobile (emulação) | 1 cenário e 7 passos aprovados | [Relatório HTML](05-mobile-opcional/relatorio.html) · [JSON](05-mobile-opcional/relatorio.json) · [Captura](05-mobile-opcional/capturas/) |

O teste de carga usou o mock local em `127.0.0.1`, com 5 usuários virtuais por 10 segundos; não representa o perfil completo de carga. O cenário mobile usa emulação de navegador Pixel 5 e não testa um aplicativo nativo.

O workflow está presente no workspace, mas ainda não há uma execução do GitHub Actions para anexar: o arquivo não está publicado no branch remoto. Assim, a evidência de CI/CD aqui é a configuração do pipeline, não um run remoto concluído.
