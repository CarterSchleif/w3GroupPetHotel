// jQuery shorthand
$(petHotelApp)

function petHotelApp() {
    console.log('jQ and client.js are running. Inside petHotelApp');
    // Event listeners
    $('#registerButton').on('click', addNewOwner);
    $('#register_new_pet').on('click', registerNewPet);
    $('#tableBody').on('click', '.deleteButton', deletePet);
    $('#tableBody').on('click', '.editButton', editPet);
    $('#tableBody').on('click', '.checkStatus', updatePetStatus);
    $('#tableBody').on('click', '.update_pet', updatePetInformation);
    $('#showVisitsButton').on('click', getPetVisits);
    if (location.pathname == '/') {
        console.log('Inside Location Pathname');
        getAllPets()
        }
}

function addNewOwner() {
    const ownerToSend = {
        first_name: $('#first_name').val(),
        last_name: $('#last_name').val()
    }
}
