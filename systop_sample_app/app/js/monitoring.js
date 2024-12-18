const path = require("path");
const ose = require("node-os-utils");
const { ipcRenderer } = require("electron");
const os = ose.os;
const cpu = ose.cpu;
const memory = ose.mem;

const MONITORING_INTERVAL = 2000;
const PRECISION = 100;
const LAST_ALERT_TIME_KEY = "lastAlertTime";

let cpuOverload = 100;
let alertFrequency = 100;

ipcRenderer.on("settings:get", (event, settings) => {
  cpuOverload = +settings.cpuOverload;
  alertFrequency = +settings.alertFrequency;
})

function assembleDynamicData() {
  cpu.usage().then(info => {

    document.getElementById("cpu-usage").innerText = `${Math.round(info * PRECISION) / PRECISION}%`;

    const cpuProgress = document.getElementById("cpu-progress")
    cpuProgress.style.width = `${info}%`;
    if (info > cpuOverload) {
      cpuProgress.style.backgroundColor = "red";
      runNotifyUserOverload();
    } else {
      cpuProgress.style.backgroundColor = "";
    }
  });
  cpu.free().then(info => {
    document.getElementById("cpu-free").innerText = `${Math.floor(info * PRECISION) / PRECISION}%`;
  })
  document.getElementById("sys-uptime").innerText = secondsInDhms(os.uptime());
};

function runNotifyUserOverload() {
  const currentTime = +new Date();
  const timeFromStorage = parseInt(localStorage.getItem(LAST_ALERT_TIME_KEY));

  if (!timeFromStorage || ((timeFromStorage + alertFrequency * 60000) < currentTime)) {
    notifyUser("CPU Overload", `CPU is over ${cpuOverload}%`);
    localStorage.setItem(LAST_ALERT_TIME_KEY, currentTime);
  }
}

function notifyUser(title, body) {
  new Notification(title, { body: body, icon: path.join(__dirname, 'img', 'icon.png') });
}

function secondsInDhms(fullSeconds) {
  fullSeconds = +fullSeconds;
  const days = Math.floor(fullSeconds / (3600 * 24));
  const hours = Math.floor((fullSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor(fullSeconds % 3600 / 60);
  const seconds = Math.floor(fullSeconds % 60);
  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
}

// Dynamic data
setInterval(assembleDynamicData, MONITORING_INTERVAL);

// Static system data
document.getElementById("cpu-model").innerText = cpu.model();
document.getElementById("comp-name").innerText = os.hostname();
document.getElementById("os").innerText = `${os.type()} ${os.arch()}`
memory.info().then(info => document.getElementById("mem-total").innerText = `${info.totalMemMb / 1024} GiB`);

ipcRenderer.on("nav:toggle", () => {
  document.getElementById("nav").classList.toggle("hide");
});