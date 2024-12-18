const settingsForm = document.getElementById("settings-form");

function showAlert(text) {
  const alertElement = document.getElementById("alert");
  alertElement.classList.remove("hide");
  alertElement.innerText = text;

  setTimeout(() => {
    alertElement.innerText = '';
    alertElement.classList.add("hide");
  }, 4000);
}

ipcRenderer.on("settings:get", (event, settings) => {
  console.log("Received new settings");
  document.getElementById("cpu-overload").value = settings.cpuOverload;
  document.getElementById("alert-frequency").value = settings.alertFrequency;
})

settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cpuOverload = document.getElementById("cpu-overload").value;
  const alertFrequency = document.getElementById("alert-frequency").value;
  ipcRenderer.send("settings:send", { cpuOverload, alertFrequency });
  showAlert("Settings updated!");
});
