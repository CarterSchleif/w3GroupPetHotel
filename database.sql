CREATE TABLE owner (
	owner_id serial primary key,
	owner_first_name VARCHAR (20),
	owner_last_name VARCHAR (20)
);

CREATE TABLE pet (
pet_id serial primary key,
pet_name VARCHAR (20),
pet_breed VARCHAR (20),
pet_color VARCHAR (20),
pet_is_checked_in VARCHAR (3) DEFAULT 'Yes'
);

CREATE TABLE owner_pet (
owner_pet_id serial primary key,
owner_pet_owner_id INT,
owner_pet_pet_id INT

);

INSERT INTO owner (owner_first_name, owner_last_name)
VALUES ('Carter', 'Schleif'), ('Michael', 'Gregoire'), ('Renne', 'Vorbeck');

INSERT INTO pet (pet_name, pet_breed, pet_color)
VALUES ('Indy', 'Cat', 'Black'), ('Rey', 'Cat', 'Brown'), ('Whitey', 'Cat', 'Grey');

Insert INTO owner_pet (owner_pet_owner_id, owner_pet_pet_id)
VALUES (1,1), (2,3), (3,2);
