document.addEventListener("DOMContentLoaded", function () {
  var container = document.getElementById("hobbyPageContainer");
  if (!container) {
    return;
  }

  var wrapper = document.createElement("div");
  wrapper.className = "position-fixed bottom-0 end-0 m-3";

  var backButton = document.createElement("button");
  backButton.type = "button";
  backButton.className = "btn btn-outline-success";
  backButton.innerHTML = '<i class="bi bi-house-door-fill"></i>&nbsp;&nbsp;Back to Home';

  wrapper.appendChild(backButton);
  container.appendChild(wrapper);

  backButton.addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
