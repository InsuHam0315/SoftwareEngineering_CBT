(function () {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form"); if (!form) return;
    const profile = document.getElementById("current-profile"); const logout = document.getElementById("logout-button"); const message = document.getElementById("login-message");
    function draw() {
      const user = SEStorage.currentUser(); const loggedIn = !user.guest;
      profile.innerHTML = `<div class="avatar">${SEStorage.escapeHTML(user.name.slice(0, 1))}</div><div><strong>${SEStorage.escapeHTML(user.name)}${loggedIn ? " 님" : " 모드"}</strong><div class="muted">${loggedIn ? SEStorage.escapeHTML(user.identifier || "추가 식별자 없음") : "로그인 없이도 게스트 기록을 사용할 수 있습니다."}</div></div>`;
      logout.hidden = !loggedIn;
      document.querySelectorAll("[data-current-user]").forEach((element) => { element.textContent = loggedIn ? `${user.name} 님` : "게스트 모드"; });
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault(); const name = form.elements.name.value.trim(); const identifier = form.elements.identifier.value.trim();
      if (!name) { message.textContent = "사용자 이름을 입력해 주세요."; return; }
      const users = SEStorage.getUsers(); const userId = SEStorage.makeUserId(name, identifier);
      let user = users.find((item) => item.userId === userId);
      if (!user) { user = { userId, name, identifier, createdAt: new Date().toISOString() }; users.push(user); SEStorage.saveUsers(users); }
      localStorage.setItem(SEStorage.CURRENT_USER_KEY, JSON.stringify({ ...user, loggedInAt: new Date().toISOString() }));
      form.reset(); message.textContent = `${name} 님으로 로그인했습니다. 사용자별 기록 저장소를 불러왔습니다.`; draw();
    });
    logout.addEventListener("click", () => { localStorage.removeItem(SEStorage.CURRENT_USER_KEY); message.textContent = "로그아웃했습니다. 현재는 게스트 모드입니다."; draw(); });
    draw();
  });
}());
