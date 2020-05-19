
// alert("I will go to the client ");
const d = document;
const stripe = Stripe('pk_test_ZN4f6Z1tmqHyaKzHblk84y2K00unLLJgRr');
const paymentBtns = d.querySelectorAll(".payment");
const loginForm = d.querySelector(".login");
const emailBox = d.querySelector(".email");
const passwordBox = d.querySelector(".password");
const logout = d.querySelector(".logout");
const updateProfile = d.querySelector(".updateProfile");
const forgetForm = d.querySelector(".forgetPassword");
const resetPasswordForm = d.querySelector(".resetPassword");
const signupForm = d.querySelector(".signup");

async function payementHelper(planId) {
  const response = await axios.post("/api/bookings/createSession", { planId });
  if (response.data.status) {
    const { session } = response.data;
    const id = session.id;
    stripe.redirectToCheckout({
      sessionId: id
    }).then(function (result) {
      alert(result.error.message);
    });

  } else {
    alert("Payment failed");
  }
}
async function updateProfileHelper(mutipartFormData) {
  const response = await axios.patch("api/users/ProfileImage", mutipartFormData);
  console.log(response.data);
  if (response.data.status === "image uploaded") {
    alert("Profile Image updated");
    location.reload();
  } else {
    alert("some error occurred");
  }

}
async function loginHelper(email, password) {
  const backendResponse = await axios.post("/api/users/login", { email, password });

  if (backendResponse.data.status === "userLogged In") {
    alert("user LoggedIn");
    //  frontent browser
    location.assign("/profile");
  } else {
    alert("Wrong Email or password");
  }
}
async function logoutHelper() {
  const backendResponse = await axios.get("/logout");
  if (backendResponse.data.status == "user LoggedOut") {
    // wrong token 
    location.reload();
  } else {
    alert("logout failed");
  }
}
async function signupHelper(email, password, confirmPassword, name) {
  const response = await axios.post("/api/users/signup", {
    email, password, confirmPassword, name
  });
  if (response.data.status === "user Signedup") {
    alert("user signedUp");
    location.assign("/");
  }
}
async function forgetPasswordHelper(email) {
  const response = await axios.patch("/api/users/forgetPassword", { email });
  if (response.data.status) {
    alert("Email Send to user");
  } else {
    alert("something went wrong");
    console.log(response.data.err);
  }
}
async function resetPasswordHelper(password, confirmPassword, resetToken) {
  const response = await axios.patch(`/api/users/resetPassword/${resetToken}`,
    {
      password, confirmPassword
    })
  if (response.data.success == "user password updated login with new password") {
    alert("Your password has been reset");
    location.assign("/login");
  } else {
    alert("something wnet wrong")
  }
}
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    // default behaviour 
    e.preventDefault();
    const email = emailBox.value;
    const password = passwordBox.value;
    loginHelper(email, password);
  })
}
if (logout) {
  logout.addEventListener("click", function () {
    logoutHelper();
  })
}
if (updateProfile) {
  updateProfile.addEventListener("change", function (e) {
    e.preventDefault();
    // capture image so that we could send to backend
    // console.log("change event occurred");
    const mutipartFormData = new FormData();
    mutipartFormData.append("photo", updateProfile.files[0]);
    updateProfileHelper(mutipartFormData);
  })
}
if (paymentBtns) {
  for (let i = 0; i < paymentBtns.length; i++) {

    paymentBtns[i].addEventListener("click", function (e) {
      e.preventDefault();
      const planId = paymentBtns[i].getAttribute("plan-id");
      payementHelper(planId);
    })
  }

}
if (forgetForm) {
  forgetForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let email = d.querySelector(".email").value;
    forgetPasswordHelper(email);
  })
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let password = d.querySelector(".password").value;
    let confirmPassword = d.querySelector(".confirmPassword").value;
    let token = d.querySelector("button[data-token]").getAttribute("data-token");
    resetPasswordHelper(password, confirmPassword, token);
  })
}

if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    // form reload 
    e.preventDefault();
    const email = d.querySelector(".email").value;
    const password = d.querySelector(".password").value
    const confirmPassword = d.querySelector(".confirmPassword").value;
    const name = d.querySelector(".name").value;
    signupHelper(email, password, confirmPassword, name);
  })
}
