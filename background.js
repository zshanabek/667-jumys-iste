async function updateRules() {
  const { blockedSites } = await chrome.storage.sync.get("blockedSites");
  const sites = blockedSites || [];

  // Remove existing rules
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIdsToRemove = existingRules.map(r => r.id);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIdsToRemove
  });

  // Add new rules
  const newRules = sites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: {
      type: "redirect",
      redirect: {
        extensionPath: "/motivational.html"
      }
    },
    condition: {
      urlFilter: site,
      resourceTypes: ["main_frame"]
    }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: newRules
  });
}

// Initialize on install or when storage changes
chrome.runtime.onInstalled.addListener(updateRules);
chrome.storage.onChanged.addListener(updateRules);
