// jQuery shorthand
$(petHotelApp)

function petHotelApp() {
    console.log('jQ and client.js are running. Inside petHotelApp');
    // Event listeners
    $('#registerButton').on('click', addNewOwner);
    $('#register_new_pet').on('click', registerNewPet);
    $('#petView').on('click', '.deleteButton', function(){
      deleteOwnerPet($(this).attr('id'));
    })
    $('#petView').on('click', '.updateButton', function(){
      editPet($(this).attr('id'));
    })
    $('#editField').on('click', '.submitEdit', function(){
      postEditPet ($(this).attr('id'));
    })
    $('#petView').on('click', '.checkIn', function(){
      updatePetStatus($(this).attr('id'), 'Yes');
    });
    $('#petView').on('click', '.checkOut', function(){
      updatePetStatus($(this).attr('id'), 'No' );
    });
    $('#showVisitsButton').on('click', getPetVisits);
    // $('#showVisitsButton').on('click', function(){
    //   getPetVisits($(this).attr('id'));
    // });
    populateSelect();
    getPets();
    $('#editField').hide();
}//end petHotelApp

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
      clearInputs();
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
    console.log('added pet to owner_pet table', data);
    getPets();
  })
  .fail(function(error){
    console.log('failure on pet POST');
  })
}// end addPetToPetOwnerTable

function checkForCheckedIn(data){
  let checkedIn = data.pet_is_checked_in;
  let buttonToPass;
  if(checkedIn == 'Yes'){
    buttonToPass = `<button class="checkOut" id=${data.pet_id}>Check OUT Pet</button>`;
  }
  else{
    buttonToPass = `<button class="checkIn" id=${data.pet_id}>Check IN Pet</button>`;
  }
  return buttonToPass;
}//end checkForCheckedIn

function clearInputs(){
  $('#owner_first_name').val('');
  $('#owner_last_name').val('');
  $('#pet_name').val('');
  $('#pet_breed').val('');
  $('#pet_color').val('');
}//end clearInputs

function deleteOwnerPet(id){
  console.log('in delete pet', id);
  $.ajax({
    type: 'DELETE',
    url: `/owner.router/${id}`
  }).done(function(data){
    console.log('success in delete from owner_pet', data);
    deletePet(id);
  })
  .fail(function(data){
    console.log('error in delete owner pet', error);
  })
}//end deleteOwnerPet

function deletePet(id){
  console.log('in delete pet2', id);
  $.ajax({
    type: 'DELETE',
    url: `/pet.router/${id}`
  }).done(function(data){
    console.log('success in delete2 from pet', data);
    getPets()
  })
  .fail(function(data){
    console.log('fail in delete2', error);
  })
}//end deletePet

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
}//end editpet

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
    $('#edit_pet_name').val('');
    $('#edit_pet_breed').val('');
    $('#edit_pet_color').val('');
    $('.submitEdit').remove();
    $('#editField').hide();
    getPets();

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
    let ownerName = data[i].owner_first_name +' '+ data[i].owner_last_name;
    let ownerID = data[i].owner_id;
    let petID = data[i].pet_id;
    let petName = data[i].pet_name;
    let breed = data[i].pet_breed;
    let color = data[i].pet_color;
    let checkButton = checkForCheckedIn (data[i]);

    stringToAppend +=`<tr scope="row"><td>${ownerName}</td><td>${petName}</td><td>${breed}</td>
                      <td>${color}</td><td><button class="updateButton" id=${ownerID}>Update</button></td>
                      <td><button class="deleteButton" id=${petID}>Delete</button><td>${checkButton}</td</tr>`;
    $('#petView').append(stringToAppend);
  }//end for loop
  clearInputs();
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

function updatePetStatus(id, answer) {
  console.log('in updatePetStatus ', id, answer, 'answer');
$.ajax({
    method: 'PUT',
    url: `/pet.router/${id}`,
    data: {answer: answer}
  }).done(function(data){
    console.log('successs put');
    getPets();
  }).fail(function(error){
    console.log('fail');
  })
}//end updatePetStatus

function getPetVisits() {
  console.log('Inside getPetVisits');
  
  let id = $('#owner_select option:selected').data('id')
  $.ajax({
      method: 'GET',
      url: `/pet.router/visits/${id}`,
      success: (response)=>{
          console.log('Back from server with the visits table data: ');
          $('#tableBody').empty();
          console.log(response);
          for (let i=0; i < response.length; i++) {
              displayPetVisits(response[i]);
          }
      }
  })
} // end getPetVisits

function displayPetVisits(data) {
  $tableRow = $('<tr>');
  $tableRow.append(`<td>${data.pet_name}</td>`);
  $tableRow.append(`<td>${data.pet_reed}</td>`);
  $tableRow.append(`<td>${data.pet_color}</td>`);
  $tableRow.append(`<td>${data.check_in_date.substr(0, 10)}</td>`);
  if (data.check_out_date == null) {
      $tableRow.append(`<td>Pet is checked in</td>`);
  }
  else {
  $tableRow.append(`<td>${data.check_out_date.substr(0, 10)}</td>`);
  }
  $('#tableBody').append($tableRow);
} // end dipslayPetVisits