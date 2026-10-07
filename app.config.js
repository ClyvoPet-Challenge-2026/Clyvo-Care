const { execFileSync } = require('node:child_process');

// Executado pelo Expo na preparação do bundle, nunca no dispositivo.
module.exports = ({ config }) => {
  let commitHash = process.env.EAS_BUILD_GIT_COMMIT_HASH || null;
  let hasLocalChanges = null;

  try {
    if (!commitHash) {
      commitHash = execFileSync('git', ['rev-parse', 'HEAD'], {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim();
    }
    hasLocalChanges = Boolean(execFileSync('git', ['status', '--porcelain'], {
      cwd: __dirname,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim());
  } catch {
    // Arquivos exportados sem Git podem não ter identificação de revisão.
  }

  if (!/^[a-f0-9]{40}$/i.test(commitHash || '')) commitHash = null;

  return {
    ...config,
    extra: {
      ...config.extra,
      appInfo: { commitHash, hasLocalChanges },
    },
  };
};
