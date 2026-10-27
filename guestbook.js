const db = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const form = document.getElementById("guestbook-form");
const list = document.getElementById("guestbook-list");
const statusEl = document.getElementById("guestbook-status");

async function loadEntries() {
  const { data, error } = await db
    .from("guestbook")
    .select("name, message, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    statusEl.textContent = "불러오기 실패: " + error.message;
    return;
  }

  list.innerHTML = "";
  if (data.length === 0) {
    statusEl.textContent = "아직 남겨진 글이 없습니다.";
    return;
  }
  statusEl.textContent = "";

  for (const entry of data) {
    const li = document.createElement("li");
    const head = document.createElement("div");
    head.className = "entry-head";
    const name = document.createElement("strong");
    name.textContent = entry.name;
    const date = document.createElement("time");
    date.textContent = new Date(entry.created_at).toLocaleString("ko-KR");
    head.append(name, date);
    const msg = document.createElement("p");
    msg.textContent = entry.message;
    li.append(head, msg);
    list.append(li);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const message = form.message.value.trim();
  if (!name || !message) return;

  const button = form.querySelector("button");
  button.disabled = true;
  const { error } = await db.from("guestbook").insert({ name, message });
  button.disabled = false;

  if (error) {
    statusEl.textContent = "저장 실패: " + error.message;
    return;
  }
  form.reset();
  loadEntries();
});

loadEntries();
