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

CREATE TABLE visits (
    id serial primary key,
    check_in_date DATE DEFAULT now(),
    check_out_date DATE DEFAULT NULL,
    pet_id INT REFERENCES pet ON DELETE CASCADE
);

CREATE TABLE owner_pet (
owner_pet_id serial primary key,
owner_pet_owner_id INT,
owner_pet_pet_id INT

);

INSERT INTO owner (owner_first_name, owner_last_name)
VALUES ('Carter', 'Schleif'), ('Michael', 'Gregoire'), ('Renee', 'Vorbeck');

INSERT INTO pet (pet_name, pet_breed, pet_color)
VALUES ('Indy', 'Cat', 'Black'), ('Rey', 'Cat', 'Brown'), ('Whitey', 'Cat', 'Grey');

INSERT INTO visits (check_in_date, check_out_date, pet_id)
VALUES ('2018-02-14', '2018-02-20', 1), ('2018-02-16', '2018-02-18', 2), ('2018-02-18', '2018-02-19', 3); 

INSERT INTO owner_pet (owner_pet_owner_id, owner_pet_pet_id)
VALUES (1,1), (2,3), (3,2);

