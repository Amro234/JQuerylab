alert("Hello world!");

let contacts = [];

$(document).on("pagecreate", "#contactListPage", function () {
  initContactList();
});

function initContactList() {
  renderContactList();
}

function renderContactList() {
  let list = $("#contactList");
  list.empty();

  $.each(contacts, function (index, contact) {
    list.append(`
            <li>
                <a href="#">
                    ${contact.name}
                    <span class="ui-li-count">${contact.phone}</span>
                </a>
            </li>
        `);
  });

  list.listview("refresh");
}
