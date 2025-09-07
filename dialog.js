
var ishtmlLoaded = false;
var modalContent = null;
var modalContainer = null;


function showModelDialog(title, conent) {
  modalContentTitle.textContent = title;
  modalContentText.textContent = conent;
  // 显示游戏结束界面
  modalContainer.classList.remove("pointer-events-none", "hidden");
  modalContent.classList.remove("scale-95");
  modalContent.classList.add("scale-100");
  document.body.style.overflow = "hidden";
}
// 关闭弹窗
const closeModalDialog = () => {
  modalContainer.classList.add("hidden");
  modalContent.classList.remove("scale-100");
  modalContent.classList.add("scale-95");
  document.body.style.overflow = "";
};

//closeModal.addEventListener("click", closeModalDialog);
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Enter" &&
    !modalContent.classList.contains("pointer-events-none")
  ) {
    closeModalDialog();
  }
});

async function initDialog()
{
  await appendHtml("./dialog.html"); // 注意：这里有可能会挡住主界面。
  modalContent = document.getElementById("modalContent");
  modalContainer = document.getElementById("modalContainer");
  ishtmlLoaded = true;
}
