// jQuery shorthand
$(petHotelApp)

function petHotelApp() {
    console.log('jQ and client.js are running. Inside petHotelApp');
    // Event listeners
    $('#registerButton').on('click', addNewOwner);
    $('#register_new_pet').on('click', registerNewPet);
    // $('#tableBody').on('click', '.deleteButton', deletePet);
    // $('#petView').on('click', '.updateButton', editPet ($(this).data('id')));
  $('#petView').on('click', '.updateButton', function(){
    editPet($(this).attr('id'));
  })
  $('#editField').on('click', '.submitEdit', function(){
    postEditPet ($(this).attr('id'));
  })
    // $('#tableBody').on('click', '.checkStatus', updatePetStatus);
    // $('#petView').on('click', '.update_pet', updatePetInformation);
    // $('#showVisitsButton').on('click', getPetVisits);
//     if (location.pathname == '/') {
//         console.log('Inside Location Pathname');
//         getAllPets()
//         }
populateSelect();
getPets();
$('#editField').hide();
}

function addNewOwner() {
    const ownerToSend = {
        first_name: $('#owner_first_name').val(),
        last_name: $('#owner_last_name').val()
    };
    addOwnerToOwnerTable(ownerToSend);

}//end addNewOwner

function addOwnerToOwnerTable(newOwner){
  $.ajax({
    url: '/owner.router',
    type: 'POST',
    data: newOwner
  }).done(function(data){
      console.log( 'added owner: ', data );
      populateSelect();
  })
    .fail(function(error){
      console.log('failure on post owner');
  });
}//end addOwnerToOwnerTable

function addPetToPetTable(petToAdd){
  $.ajax({
    url: '/pet.router',
    type: 'POST',
    data: petToAdd
  }).done(function(data){
    console.log('added pet', data);
    addPetToPetOwnerTable(petToAdd);
  })
  .fail(function(error){
    console.log('failure on pet POST');
  })
}//end addPetToPetTable

function addPetToPetOwnerTable (petToAdd){
  $.ajax({
    url: '/pet.router/pet_owner',
    type: 'POST',
    data: petToAdd
  }).done(function(data){
    console.log('added pet', data);
  })
  .fail(function(error){
    console.log('failure on pet POST');
  })
}// end addPetToPetOwnerTable

function checkForCheckedIn(data){
  let checkedIn = data.pet_is_checked_in;
  let buttonToPass;
  if(checkedIn == 'Yes'){
    buttonToPass = `<button class="checkInOut" id="data.owner_id">Checked IN</button>`;
  }
  else{
    buttonToPass = `<button class="checkInOut" id="data.owner_id">Checked OUT</button>`;
  }
  return buttonToPass;
}//end checkForCheckedIn

function clearInputs(){

}

function editPet(id) {
  console.log('in editpet');
  console.log(id);
  $('#editField').show();

  $.ajax({
    type: 'GET',
    url: `pet.router/${id}`
  }).done(function(data){
    console.log('success in edit GET', data);
    fillEditField(data);
  })
  .fail(function(error){
    console.log(error, 'error in editGET');
  })
}

function fillEditField (data){
  console.log('in filledit', data);
  $('#edit_pet_name').val(data[0].pet_name);
  $('#edit_pet_breed').val(data[0].pet_breed);
  $('#edit_pet_color').val(data[0].pet_color);
  $('#editField').append(`<button class='submitEdit' id="${data[0].pet_id}">Submit Edit</button>`)
}//end fillEditField




function getPets(){
  console.log('in getPets');
  $.ajax({
    type: 'GET',
    url: '/pet.router'
  })
    .done(function(data){
      console.log( 'got petList: ', data );
    writePets(data);
    })
    .fail(function(error){
      console.log('failure on get getPets');
    })
}//end getPets

function populateSelect(){
  $.ajax({
    url:'/owner.router',
    type: 'GET'
  }).done(function(data){
    console.log('success in ownerGET', data);
    writeToSelect(data);
  })
  .fail(function(error){
    console.log('error on ownerGET', error);
  })
}//end populateSelect

function postEditPet(id){
  console.log(id, 'in post edit');
  $.ajax({
    type: 'PUT',
    url: `/pet.router/update/${id}`,
    data: {
      editName:   $('#edit_pet_name').val(),
      editBreed:  $('#edit_pet_breed').val(),
      editColor:  $('#edit_pet_color').val(),
    }
  }).done(function(data){
    console.log('success in editpet', data);
    $('editField').hide();
  })
  .fail(function(error){
    console.log('error on put', error);
  })
}//postEditPet

function registerNewPet (){
  const petToRegister = {
    pet_name: $('#pet_name').val(),
    pet_breed: $('#pet_breed').val(),
    pet_color: $('#pet_color').val(),
    pet_owner: $('#owner_select').val()
  };
  addPetToPetTable(petToRegister);
}//end registerNewPet

function writePets(data){

  $('#petView').empty();
  for(i=0; i<data.length; i++){
    console.log(data[i], 'in write');
    let stringToAppend;
    let ownerName = data[i].owner_first_name + data[i].owner_last_name;
    let ownerID = data[i].owner_id;

    let petName = data[i].pet_name;
    let breed = data[i].pet_breed;
    let color = data[i].pet_color;

    let checkButton = checkForCheckedIn (data[i]);

    stringToAppend +=`<tr><td>${ownerName}</td><td>${petName}</td><td>${breed}</td>
                      <td>${color}</td><td><button class="updateButton" id=${ownerID}>Update</button></td>
                      <td><button class="deleteButton" id=${ownerID}>Delete</button><td>${checkButton}</td</tr>`;
    $('#petView').append(stringToAppend);
  }//end for loop
  // clearInputs();
};//end writePets


function writeToSelect(data){
  console.log(data, 'data in write to select');
  $('#owner_select').empty()

  for(i=0; i<data.length; i++){
    let ownerToWrite = data[i];
    console.log(ownerToWrite);
    $('#owner_select').append(`<option value="${ownerToWrite.owner_id}">${ownerToWrite.owner_first_name}`+' '+`${ownerToWrite.owner_last_name}</option>`);
  }//end for
}//end writeToSelect
