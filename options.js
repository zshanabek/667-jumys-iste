const input = document.getElementById("site-input");
const form = document.getElementById("block-form");
const list = document.getElementById("site-list");

async function loadSites() {
  const { blockedSites } = await chrome.storage.sync.get("blockedSites");
  return blockedSites || [];
}

async function saveSites(sites) {
  await chrome.storage.sync.set({ blockedSites: sites });
}

function renderSites(sites) {
  list.innerHTML = "";
  sites.forEach((site, index) => {
    const li = document.createElement("li");
    li.textContent = site;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Жою";
    delBtn.onclick = async () => {
      sites.splice(index, 1);
      await saveSites(sites);
      renderSites(sites);
    };

    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newSite = input.value.trim();
  if (!newSite) return;

  let sites = await loadSites();
  if (!sites.includes(newSite)) {
    sites.push(newSite);
    await saveSites(sites);
    renderSites(sites);
  }

  input.value = "";
});

loadSites().then(renderSites);
