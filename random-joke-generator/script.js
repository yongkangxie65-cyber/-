const getJokeBtn = document.getElementById('getJoke');
const apiSelect = document.getElementById('api');
const jokeEl = document.getElementById('joke');
const errorEl = document.getElementById('error');
const copyBtn = document.getElementById('copyBtn');

async function fetchJoke() {
  errorEl.textContent = '';
  jokeEl.textContent = '加载中...';

  try {
    const api = apiSelect.value;
    let text = '';

    if (api === 'icanhaz') {
      // icanhazdadjoke 要求 Accept: application/json
      const res = await fetch('https://icanhazdadjoke.com/', {
        headers: { Accept: 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      text = data.joke;
    } else {
      // Official Joke API 返回 {setup, punchline}
      const res = await fetch('https://official-joke-api.appspot.com/random_joke');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      text = data.setup ? `${data.setup}\n\n${data.punchline}` : (data.joke || JSON.stringify(data));
    }

    jokeEl.textContent = text;
    return text;
  } catch (err) {
    jokeEl.textContent = '获取失败';
    errorEl.textContent = '错误：' + err.message;
    console.error(err);
    return null;
  }
}

getJokeBtn.addEventListener('click', fetchJoke);

copyBtn.addEventListener('click', async () => {
  const text = jokeEl.textContent;
  if (!text || text === '加载中...' || text === '获取失败') return;
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '已复制';
    setTimeout(() => (copyBtn.textContent = '复制'), 1500);
  } catch (e) {
    alert('复制失败: ' + e.message);
  }
});

// 自动在页面加载时获取一个笑话
fetchJoke();
