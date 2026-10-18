const ACCOUNT_1 = 'Megarukaza';
const ACCOUNT_2 = 'GGMaas';
const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; //6 hours
const RATE_LIMIT_RESET_KEY = 'github-api-rate-limit-reset';

function readCache(key) {
  try {
    const cached = localStorage.getItem(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.warn('Could not read the GitHub data cache.', error);
    return null;
  }
}

function saveCache(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data, savedAt: Date.now() })
    );
  } catch (error) {
    console.warn('Could not save GitHub data to the cache.', error);
  }
}

function getRateLimitMessage(resetAt) {
  if (!resetAt) {
    return 'GitHub API rate limit reached. Please try again later.';
  }

  const resetTime = new Date(Number(resetAt) * 1000).toLocaleTimeString();
  return `GitHub API rate limit reached. Try again after ${resetTime}.`;
}

async function getGitHubData(url) {
  const cacheKey = `github-api:${url}`;
  const cached = readCache(cacheKey);
  const validCache =
    cached &&
    typeof cached.savedAt === 'number' &&
    Object.prototype.hasOwnProperty.call(cached, 'data')
      ? cached
      : null;

  if (validCache && Date.now() - validCache.savedAt < CACHE_DURATION_MS) {
    return { data: validCache.data, stale: false };
  }

  const savedReset = readCache(RATE_LIMIT_RESET_KEY);
  const savedResetAt = savedReset && savedReset.data;
  if (savedResetAt && Number(savedResetAt) * 1000 > Date.now()) {
    if (validCache) {
      return { data: validCache.data, stale: true, rateLimited: true };
    }
    throw new Error(getRateLimitMessage(savedResetAt));
  }

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    if (validCache) {
      return { data: validCache.data, stale: true, rateLimited: false };
    }
    throw error;
  }

  const data = await response.json();
  if (!response.ok) {
    const rateLimited =
      response.status === 429 ||
      response.headers.get('X-RateLimit-Remaining') === '0' ||
      /rate limit exceeded/i.test(data.message || '');

    if (rateLimited) {
      const resetAt = response.headers.get('X-RateLimit-Reset');
      if (resetAt) saveCache(RATE_LIMIT_RESET_KEY, resetAt);
      if (validCache) {
        return { data: validCache.data, stale: true, rateLimited: true };
      }
      throw new Error(getRateLimitMessage(resetAt));
    }

    if (validCache) {
      return { data: validCache.data, stale: true, rateLimited: false };
    }

    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  saveCache(cacheKey, data);
  return { data, stale: false };
}

async function getProfileData(username) {
  return await getGitHubData(`https://api.github.com/users/${username}`);
}

async function getUserRepos(username) {
  return await getGitHubData(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=3`
  );
}

function buildProfileHeader(profile, label) {
  const header = document.createElement('div');
  header.className = 'account-header';

  const img = document.createElement('img');
  img.src = profile.avatar_url;
  img.className = 'account-avatar';

  const title = document.createElement('h3');
  title.textContent = `${profile.name || profile.login} (${label})`;

  header.appendChild(img);
  header.appendChild(title);
  return header;
}

function buildRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'repo-card';

  const title = document.createElement('h4');
  title.textContent = repo.name;

  const link = document.createElement('a');
  link.href = repo.html_url;
  link.textContent = 'Look here →';

  card.appendChild(title);
  card.appendChild(link);
  return card;
}

async function loadAccountColumn(username, label, containerElement) {
  try {
    const profile = await getProfileData(username);
    const repos = await getUserRepos(username);

    containerElement.replaceChildren(buildProfileHeader(profile.data, label));
    repos.data.forEach(repo => containerElement.appendChild(buildRepoCard(repo)));

    if (profile.stale || repos.stale) {
      const status = document.createElement('p');
      status.className = 'account-status';
      status.setAttribute('role', 'status');
      status.textContent =
        profile.rateLimited || repos.rateLimited
          ? 'Showing saved GitHub data; the API rate limit prevented an update.'
          : 'Showing saved GitHub data; it could not be updated right now.';
      containerElement.appendChild(status);
    }

  } catch (error) {
    console.error(error);
    containerElement.querySelector('.account-status').textContent =
      error instanceof Error &&
      error.message.startsWith('GitHub API rate limit reached.')
        ? error.message
        : 'GitHub-data couldnt be loaded.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadAccountColumn(ACCOUNT_1, 'Main account', document.getElementById('account-1-column'));
  loadAccountColumn(ACCOUNT_2, 'School account', document.getElementById('account-2-column'));
});