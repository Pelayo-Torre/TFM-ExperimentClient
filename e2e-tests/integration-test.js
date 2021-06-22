describe('Protractor Demo App', function() {
  it('create account', function() {
    browser.get('http://localhost:4200/');
	
	//Se comienza registrando al investigador en el sistema
	element(by.id('registerUser')).click();
	
	//Se comprueba que se está en la ventana de registro de investigador
	expect( browser.getCurrentUrl() ).toMatch( '/investigator/register' );
	
	//***************************************REGISTRAR INVESTIGADOR***************************************//
	
	//Se rellena el formulario de registro de usuario
	element(by.id('firstname1')).sendKeys("Pelayo");
	element(by.id('lastname1')).sendKeys("García Torre");
	element(by.id('mail1')).sendKeys("pelayo@gmail.com");
	element(by.id('password1')).sendKeys("123456789");
	element(by.id('password2')).sendKeys("123456789");
	element(by.id('formButton')).click();
	
	//Se comprueba que se registra el usuario de manera correcta
	expect( browser.getCurrentUrl() ).toMatch( '/login' );
	
	//***************************************INICIAR SESIÓN***************************************//
	
	//Se autentica el usuario en sesión
	element(by.id('mail')).sendKeys("pelayo@gmail.com");
	element(by.id('password1')).sendKeys("123456789");
	element(by.id('formButton')).click();
	
	//Se comprueba que el login fue correcto
	expect( browser.getCurrentUrl() ).toMatch( '/experiments' );
	
	//***************************************REGISTRAR EXPERIMENTO***************************************//
	
	//Se redirige a la ventana de crear un experimento
	element(by.id('addExperiment')).click();
	
	//Se comprueba que se está en el formulario de alta de experimento
	expect( browser.getCurrentUrl() ).toMatch( '/experiments/register' );
	
	//Se da de alta el experimento
	element(by.id('titleInput')).sendKeys("Experimento en Langreo");
	element(by.id('description')).sendKeys("Prueba en ordenadores con ninos de 12 a 16 anos.");
	
	element(by.id('addDemographicData')).click();
	element(by.id('addDemographicData')).click();
	element(by.id('addDemographicData')).click();
	element(by.id('addDemographicData')).click();
	
	element(by.className('inputFilter0')).sendKeys("Profesion");
	element(by.className('inputFilter1')).sendKeys("Fecha de nacimiento");
	element(by.className('inputFilter2')).sendKeys("Lateralidad");

	element(by.id('type0')).click();
	element(by.className('type-STRING')).click();

	element(by.id('type1')).click();
	element(by.className('type-DATE')).click();
	
	element(by.id('type2')).click();
	element(by.className('type-NUMBER')).click();
	
	element(by.id('delete3')).click();
	
	element(by.id('formButton')).click();
	
	//Se comprueba que el experimento se ha registrado de manera correcta
	expect( browser.getCurrentUrl() ).toMatch( '/experiments' );
	
	//***************************************LISTAR EXPERIMENTOS***************************************//
	
	browser.sleep(500);
	
	//Se comprueba que se encuentra el experimento creado en la lista
	expect(element(by.className('col1')).getAttribute('text')).toEqual('Experimento en Langreo');
	expect(element(by.className('col2')).getText()).toEqual('Prueba en ordenadores con ninos de 12 a 16 anos.');
	expect(element(by.className('col4')).getText()).toEqual('CREADO');
	
	//***************************************BUSCAR UN EXPERIMENTO***************************************//
	
	//Se busca el experimento
	element(by.className('inputFilterTitle')).sendKeys("Langreo");
	element(by.className('inputFilterDescription')).sendKeys("en ordenadores con ninos de 12");
	element(by.id('statuses')).click();
	element(by.id('status-created')).click();
	
	browser.sleep(500);
	
	//Se comprueba que se encuentra el experimento creado en la lista
	expect(element(by.className('col1')).getAttribute('text')).toEqual('Experimento en Langreo');
	expect(element(by.className('col2')).getText()).toEqual('Prueba en ordenadores con ninos de 12 a 16 anos.');
	expect(element(by.className('col4')).getText()).toEqual('CREADO');
	
	//***************************************VISUALIZAR DETALLE DE UN EXPERIMENTO***************************************//
	
	element(by.className('col1')).click();
	
	expect( browser.getCurrentUrl() ).toMatch( '/experiments/detail' );
	
	browser.sleep(500);
	
	//Comprobamos que son los datos del experimento creado
	expect(element(by.id('pTitle')).getText()).toEqual('Experimento en Langreo');
	expect(element(by.id('pDescription')).getText()).toEqual('Prueba en ordenadores con ninos de 12 a 16 anos.');
	expect(element(by.id('status')).getText()).toEqual('CREADO');
	expect(element(by.id('creator')).getText()).toEqual('Pelayo García Torre ( pelayo@gmail.com )');
	
	//***************************************EDITAR DATOS DE UN EXPERIMENTO***************************************//
	
	element(by.id('editExperiment')).click();

	element(by.id('editTitle')).clear();
	element(by.id('editDescription')).clear();
	element(by.id('editTitle')).sendKeys("Experimento en SAMA");
	element(by.id('editDescription')).sendKeys("Prueba en ordenadores con adultos de 25 a 35 anos");
	
	element(by.id('delete0')).click();
	element(by.id('delete1')).click();
	
	element(by.id('formButton')).click();
	
	//Se comprueba que los datos se han editado correctamente
	browser.sleep(500);
	
	//Comprobamos que son los datos del experimento creado
	expect(element(by.id('pTitle')).getText()).toEqual('Experimento en SAMA');
	expect(element(by.id('pDescription')).getText()).toEqual('Prueba en ordenadores con adultos de 25 a 35 anos');
	expect(element(by.id('status')).getText()).toEqual('CREADO');
	
	//***************************************CAMBIAR EL ESTADO DE UN EXPERIMENTO***************************************//
	
	element(by.id('dropdownStatus')).click();
	element(by.id('status-OPEN')).click();
	
	element(by.id('openExperimentBtn')).click();
	
	//Se comprueba que los datos se han editado correctamente
	browser.sleep(3000);
	expect(element(by.id('status')).getText()).toEqual('ABIERTO');
	
	//Se cierra el experimento
	element(by.id('dropdownStatus')).click();
	element(by.id('status-CLOSE')).click();
	
	//Se comprueba que los datos se han editado correctamente
	browser.sleep(3000);
	expect(element(by.id('status')).getText()).toEqual('CERRADO');
	
	//Se reabre el experimento
	element(by.id('dropdownStatus')).click();
	element(by.id('status-REOPEN')).click();
	
	//Se comprueba que los datos se han editado correctamente
	browser.sleep(3000);
	expect(element(by.id('status')).getText()).toEqual('ABIERTO');
	
	//***************************************LISTAR INVESTIGADORES ASOCIADOS A UN EXPERIMENTO***************************************//
	
	//Se comprueba que el investigador se encuentra en la lista de investigadores asociados
	expect(element(by.className('col1')).getText()).toEqual('Pelayo');
	expect(element(by.className('col2')).getText()).toEqual('pelayo@gmail.com');
	expect(element(by.className('col3')).getText()).toEqual('Gestor');
	
	//***************************************CREAR UNA ASOCIACIÓN CON OTRO INVESTIGADOR***************************************//
	
	//Se empieza registrando un nuevo investigador
	element(by.id('logout')).click();
	
	element(by.id('registerUser')).click(); 
	
	//Se comprueba que se está en la ventana de registro de investigador
	expect( browser.getCurrentUrl() ).toMatch( '/investigator/register' );
		
	//Se rellena el formulario de registro de usuario
	element(by.id('firstname1')).sendKeys("Juan");
	element(by.id('lastname1')).sendKeys("Llaneza");
	element(by.id('mail1')).sendKeys("juan@gmail.com");
	element(by.id('password1')).sendKeys("123456789");
	element(by.id('password2')).sendKeys("123456789");
	element(by.id('formButton')).click();
	
	//Se comprueba que se registra el usuario de manera correcta
	expect( browser.getCurrentUrl() ).toMatch( '/login' );
	
	//Accedemos como pelayo y envíamos la petición de asociación
	element(by.id('mail')).sendKeys("pelayo@gmail.com");
	element(by.id('password1')).sendKeys("123456789");
	element(by.id('formButton')).click();
	
	element(by.className('col1')).click();
	expect( browser.getCurrentUrl() ).toMatch( '/experiments/detail' );
	
	//Registramos la petición de asociación
	
	element(by.id('addAssociationBtn')).click();
	element(by.id('mailInp')).sendKeys("juan@gmail.com");
	element(by.className('chekManager')).click();
	
	browser.sleep(500);
	
	element(by.id('formButtonSendPeticion')).click();
	browser.sleep(500);
	
	//***************************************LISTAR LAS PETICIONES DE ASOCIACIÓN ENVIADAS***************************************//
	
	//Comprobamos que en la lista de peticiones enviadas aparece la que se acaba de enviar y está en estado pendiente
	element(by.id('petitionsNav')).click();
	browser.sleep(500);
	element(by.id('subMenu4')).click();
	
	expect( browser.getCurrentUrl() ).toMatch( '/petitions/sent' );
	
	browser.sleep(2000);
	expect(element(by.className('mail-investigator')).getText()).toEqual('juan@gmail.com');
	expect(element(by.className('PENDING')).getText()).toEqual('PENDIENTE');
	
	//***************************************LISTAR LAS PETICIONES DE ASOCIACIÓN RECIBIDAS***************************************//
	
	//Accedemos como Juan al sistema y comprobamos que tiene una petición recibida
	element(by.id('logout')).click();
	
	//Se comprueba que se registra el usuario de manera correcta
	expect( browser.getCurrentUrl() ).toMatch( '/login' );
	
	element(by.id('mail')).sendKeys("juan@gmail.com");
	element(by.id('password1')).sendKeys("123456789");
	element(by.id('formButton')).click();
	
	//Accedemos a la lista de peticiones recibidas
	element(by.id('petitionsNav')).click();
	browser.sleep(500);
	element(by.id('subMenu3')).click();
	
	expect( browser.getCurrentUrl() ).toMatch( '/petitions/received' );
	
	browser.sleep(2000);
	expect(element(by.className('title-experiment')).getText()).toEqual('Experimento en SAMA');
	expect(element(by.className('PENDING')).getText()).toEqual('PENDIENTE');
	
	//***************************************ACEPTAR UNA PETICIÓN RECIBIDA***************************************//
	
	element(by.className('acceptBtn')).click();
	browser.sleep(1000);
	element(by.id('acceptConfirmBtn')).click();
	browser.sleep(1000);
	
	//Se comprueba que el estado de la petición está aceptada
	expect(element(by.className('ACCEPTED')).getText()).toEqual('ACEPTADA');
	
	//***************************************CANCELAR UNA PETICIÓN RECIBIDA***************************************//
	
	element(by.className('cancelBtn')).click();
	browser.sleep(1000);
	element(by.id('cancelConfirmBtn')).click();
	browser.sleep(3000);
	
	//Se comprueba que el estado de la petición está aceptada
	expect(element(by.className('CANCELLED')).getText()).toEqual('CANCELADA');
	
	//***************************************CREAR UNA NOTA EN LA BITÁCORA***************************************//
	
	element(by.id('logout')).click();
	
	element(by.id('mail')).sendKeys("pelayo@gmail.com");
	element(by.id('password1')).sendKeys("123456789");
	element(by.id('formButton')).click();
	expect( browser.getCurrentUrl() ).toMatch( '/experiments' );
	browser.sleep(1000);

	element(by.className('col1')).click();
	expect( browser.getCurrentUrl() ).toMatch( '/experiments/detail' );

	browser.sleep(1000);
	
	//Se crea una nueva nota en la bitácora
	element(by.id('addNoteBtn')).click();
	
	element(by.id('titleNote')).sendKeys("Creacion de experimento");
	element(by.id('descriptionNote')).sendKeys("Se ha creado el experimento para hacer pruebas sobre personas entre 12 y 16 anos.");
	browser.sleep(500);
	
	element(by.id('formButtonAddNote')).click();
	browser.sleep(3000);
	
	//Se comprueba que se ha añadido la nota
	expect(element.all(by.className('titleNote')).first().getText()).toEqual('Creacion de experimento');
	expect(element.all(by.className('descriptionNote')).first().getText()).toEqual('Se ha creado el experimento para hacer pruebas sobre personas entre 12 y 16 anos.');
	
	//***************************************EDITAR UNA NOTA EN LA BITÁCORA***************************************//
	
	element.all(by.className('editNoteBtn')).first().click();
	browser.sleep(1000);
	
	element(by.id('titleNote')).clear();
	element(by.id('descriptionNote')).clear();
	element(by.id('titleNote')).sendKeys("Creacion de experimento para menores");
	element(by.id('descriptionNote')).sendKeys("Se ha creado el experimento para hacer pruebas sobre menores entre 12 y 16 anos.");
	browser.sleep(500);
	
	element(by.id('formButtonUpdateNote')).click();
	browser.sleep(1000);
	
	//Se comprueba que se actualizado de manera correcta
	expect(element.all(by.className('titleNote')).first().getText()).toEqual('Creacion de experimento para m');
	expect(element.all(by.className('descriptionNote')).first().getText()).toEqual('Se ha creado el experimento para hacer pruebas sobre menores entre 12 y 16 anos.');
	
	//***************************************ELIMINAR UNA NOTA EN LA BITÁCORA***************************************//
	
	element.all(by.className('deleteNoteBtn')).first().click();
	browser.sleep(1000);
	element(by.id('confirmDeleteBtn')).click();
	
	//***************************************EDITAR LOS DATOS DEL PERFIL***************************************//
	
	browser.sleep(3000);
	
	element(by.id('profile')).click();
	
	//comprobamos que se cargan los datos del investigador en sesión
	expect(element(by.id('firstnameSpan')).getText()).toEqual('Pelayo');
	expect(element(by.id('lastname1Span')).getText()).toEqual('García Torre');
	expect(element(by.id('mail1Span')).getText()).toEqual('pelayo@gmail.com');
	expect(element(by.id('pruebaRole')).getText()).toEqual('Periodo de prueba');
	
	browser.sleep(1000);
	
	//Editamos los datos del investigador
	element(by.id('editBtn')).click();
	element(by.id('firstname1')).clear();
	element(by.id('lastname1')).clear();
	element(by.id('mail1')).clear();
	
	element(by.id('firstname1')).sendKeys("Pedro");
	element(by.id('lastname1')).sendKeys("Llaneza");
	element(by.id('mail1')).sendKeys("pedron@gmail.com");
	
	browser.sleep(2000);
	
	element(by.id('editButton')).click();
	
	browser.sleep(2000);
	
	//Se comprueba que los datos se han modificado
	expect(element(by.id('firstnameSpan')).getText()).toEqual('Pedro');
	expect(element(by.id('lastname1Span')).getText()).toEqual('Llaneza');
	expect(element(by.id('mail1Span')).getText()).toEqual('pedron@gmail.com');
  });
});