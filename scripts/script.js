alert("Hello world!");

let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
let selectedId = null;

$(document).on("pagebeforeshow", "#home", function () {
  renderContacts();
});

function renderContacts() {
  const list = $("#contactList");
  list.empty();

  if (contacts.length === 0) {
    list.append("<li>No contacts found</li>");
  } else {
    contacts.forEach((contact) => {
      let imgSrc = "assets/images/avatar.png";
      if (contact.gender === "male") {
        imgSrc = "assets/images/male.png";
      } else if (contact.gender === "female") {
        imgSrc = "assets/images/female.jpeg";
      }

      list.append(`
                <li>
                    <a href="#view" class="view-contact" data-id="${contact.id}">
                        <img src="${imgSrc}" />
                        ${contact.name}
                    </a>
                </li>
            `);
    });
  }

  list.listview("refresh");
}

$(document).on("click", ".view-contact", function () {
  const id = Number($(this).data("id"));
  viewContact(id);
});

function viewContact(id) {
  selectedId = id;
  const c = contacts.find((x) => x.id === id);
  if (!c) return;

  $("#viewName").text(c.name);
  $("#viewPhone").text(c.phone);
  $("#viewEmail").text(c.email || "No Email");
  $("#callBtn").attr("href", "tel:" + c.phone);

  if (c.gender === "male") {
    $("#viewImg").attr("src", "assets/images/male.png");
  } else if (c.gender === "female") {
    $("#viewImg").attr("src", "assets/images/female.jpeg");
  } else {
    $("#viewImg").attr("src", "assets/images/avatar.png");
  }
}

$(document).on("click", "#editBtn", function () {
  editContact();
});

function editContact() {
  const c = contacts.find((x) => x.id === selectedId);
  if (!c) return;

  $("#contactId").val(c.id);
  $("#name").val(c.name);
  $("#phone").val(c.phone);
  $("#email").val(c.email);

  if (c.gender) {
    $(`input[name="gender"][value="${c.gender}"]`)
      .prop("checked", true)
      .checkboxradio("refresh");
  }

  $("#add h1").text("Edit Contact");
}

$(document).on("click", "a[href='#add']", function () {
  if ($(this).attr("id") !== "editBtn") {
    $("#contactId").val("");
  }
});

$(document).on("pagebeforeshow", "#add", function () {
  if (!$("#contactId").val()) {
    $("#contactForm")[0].reset();
    $("input[name='gender']").prop("checked", false).checkboxradio("refresh");
    $("#add h1").text("New Contact");
  }
});

$(document).on("submit", "#contactForm", function (e) {
  e.preventDefault();

  const id = $("#contactId").val();

  if (id) {
    const c = contacts.find((x) => x.id == id);
    if (!c) return;

    c.name = $("#name").val();
    c.phone = $("#phone").val();
    c.email = $("#email").val();
    c.gender = $("input[name='gender']:checked").val();
  } else {
    contacts.push({
      id: Date.now(),
      name: $("#name").val(),
      phone: $("#phone").val(),
      email: $("#email").val(),
      gender: $("input[name='gender']:checked").val(),
    });
  }

  localStorage.setItem("contacts", JSON.stringify(contacts));

  this.reset();
  $("#contactId").val("");
  selectedId = null;

  $.mobile.changePage("#home");
});

$(document).on("click", "#confirmDelete", function () {
  contacts = contacts.filter((c) => c.id !== selectedId);
  localStorage.setItem("contacts", JSON.stringify(contacts));
  selectedId = null;

  $.mobile.changePage("#home");
});
