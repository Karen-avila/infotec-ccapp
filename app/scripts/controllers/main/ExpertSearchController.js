(function (module) {
    mifosX.controllers = _.extend(module, {
        ExpertSearchController: function (scope, resourceFactory, location) {
        	scope.dashModel = 'dashboard';
            scope.switch = function() {
	        	location.path('/richdashboard');
			}

			scope.searchLabels = {
				'es-mx': ['Crear Cliente', 'Clientes', 'Crear Grupo', 'Grupos', 'Centros', 'Crear Centros', 'Configuracion', 'Tareas pendientes', 'Plantillas', 'Usuarios del Sistema',
				'Crear Plantilla', 'Crear Producto de Prestamo', 'Crear Producto de Caja de Ahorro', 'Roles', 'Agregar Roles', 'Creador de tareas del verificador',
				'Usuarios', 'Productos de Prestamo', 'Cargos', 'Productos de Caja de Ahorro', 'Oficinas', 'Crear Oficina', 'Configuracion del tipo de Moneda', 'Configuracion de Usuarios',
				'Crear Usuario', 'Empleados', 'Crear Empleados', 'Configurar los fondos', 'offices', '´Plan de Cuentas', 'Publicaciones Frecuentes', 'Entrada de Libro Diario',
				'Buscar Transaccion', 'Cierres Contables', 'Reglas de Contabilidad', 'Agregar Regla Contable', 'Tablas de Datos', 'Crear Tablas de Datos', 'Agregar Codigo',
				'Gestionar Planificador de Trabajos', 'Codigos', 'Reportes', 'Crear Reportes', 'Vacaciones', 'Crear Vacaciones', 'Crear Cargos', 'Producto Mixto', 'Crear Producto Mixto',
				'Reasignacion de Prestamo en masa', 'Auditoría', 'Crear Cierres Contables', 'Hoja de Recaudacion', 'Navegacion', 'Contabilidad', 'Organizacion', 'Sistema'],
				'en': ['create client', 'clients', 'create group', 'groups', 'centers', 'create center', 'configuration', 'tasks', 'templates', 'system users',
				'create template', 'create loan product', 'create saving product', 'roles', 'add role', 'configure maker checker tasks',
				'users', 'loan products', 'charges', 'saving products', 'offices', 'create office', 'currency configurations', 'user settings',
				'create user', 'employees', 'create employee', 'manage funds', 'offices', 'chart of accounts', 'frequent postings', 'Journal entry',
				'search transaction', 'account closure', 'accounting rules', 'add accounting rule', 'data tables', 'create data table', 'add code',
				'jobs', 'codes', 'reports', 'create report', 'holidays', 'create holiday', 'create charge', 'product mix', 'add member', 'add product mix',
				'bulk loan reassignment', 'audit', 'create accounting closure', 'enter collection sheet', 'navigation', 'accounting', 'organization', 'system']
			}
            
			scope.searchParams = scope.searchLabels[scope.optlang.code];
			
			scope.search = function () {
		      switch (this.formData.search.toLowerCase()) {
		          case 'create client':
				  case 'crear cliente':
		              location.path('/createclient');
		              break;
		          case 'clients':
				  case 'clientes':
				  	  location.path('/clients');
		              break;
		          case 'create group':
				  case 'crear grupo':
		              location.path('/creategroup');
		              break;
		          case 'groups':
				  case 'grupos':
		              location.path('/groups');
		              break;
		          case 'create center':
				  case 'crear centro':
		              location.path('/createcenter');
		              break;
		          case 'centers':
				  case 'centros':
		              location.path('/centers');
		              break;
		          case 'configuration':
				  case 'configuracion':
		              location.path('/global');
		              break;
		          case 'tasks':
				  case 'tareas':
		              location.path('/tasks');
		              break;
		          case 'templates':
				  case 'plantillas':
		              location.path('/templates');
		              break;
		          case 'create template':
				  case 'crear plantilla':
		              location.path('/createtemplate');
		              break;
		          case 'create loan product':
				  case 'crear producto de prestamo':
		              location.path('/createloanproduct');
		              break;
		          case 'create saving product':
				  case 'crear producto de caja de ahorro':
		              location.path('/createsavingproduct');
		              break;
		          case 'roles':
		              location.path('/admin/roles');
		              break;
		          case 'add role':
				  case 'agregar role':
		              location.path('/admin/addrole');
		              break;
		          case 'configure maker checker tasks':
				  case 'creador de tareas del verificador':
		              location.path('/admin/viewmctasks');
		              break;
		          case 'loan products':
				  case 'productos de prestamo':
		              location.path('/loanproducts');
		              break;
		          case 'charges':
				  case 'cargos':
		              location.path('/charges');
		              break;
		          case 'saving products':
				  case 'productos de caja de ahorro':
		              location.path('/savingproducts');
		              break;
		          case 'offices':
				  case 'oficinas':
		              location.path('/offices');
		              break;
		          case 'create office':
				  case 'crear oficina':
		              location.path('/createoffice');
		              break;
		          case 'currency configurations':
				  case 'configuracion del tipo de moneda':
		              location.path('/currconfig');
		              break;
		          case 'user settings':
				  case 'configuracion de usuarios':
		              location.path('/usersetting');
		              break;
		          case 'employees':
				  case 'empleados':
		              location.path('/employees');
		              break;
		          case 'create employee':
				  case 'crear empleado':
		              location.path('/createemployee');
		              break;
		          case 'manage funds':
				  case 'configurar los fondos':
		              location.path('/managefunds');
		              break;
		          case 'chart of accounts':
				  case 'plan de cuentas':
		              location.path('/accounting_coa');
		              break;
		          case 'frequent postings':
				  case 'publicaciones frecuentes':
		              location.path('/freqposting');
		              break;
		          case 'journal entry':
				  case 'entrada de libro diario':
		              location.path('/journalentry');
		              break;
		          case 'search transaction':
				  case 'buscar transaccion':
		              location.path('/searchtransaction');
		              break;
		          case 'account closure':
				  case 'cierres contables':
		              location.path('/accounts_closure');
		              break;
		          case 'accounting rules':
				  case 'reglas de contabilidad':
		              location.path('/accounting_rules');
		              break;
		          case 'add accounting rule':
				  case 'agregar regla contable':
		              location.path('/add_accrule');
		              break;
		          case 'data tables':
				  case 'tabla de datos':
		              location.path('/datatables');
		              break;
		          case 'create data table':
				  case 'crear tabla de datos':
		              location.path('/createdatatable');
		              break;
		          case 'add code':
				  case 'agregar codigo':
		              location.path('/addcode');
		              break;
		          case 'jobs':
				  case 'gestionar planificador de trabajos':
		              location.path('/jobs');
		              break;
		          case 'codes':
				  case 'codigos':
		              location.path('/codes');
		              break;
		          case 'reports':
				  case 'reportes':
		              location.path('/reports');
		              break;
		          case 'create report':
				  case 'crear reporte':
		              location.path('/createreport');
		              break;
		          case 'holidays':
				  case 'vacaciones':
		              location.path('/holidays');
		              break;
		          case 'create holiday':
				  case 'crear vacaciones':
		              location.path('/createholiday');
		              break;
		          case 'add member':
				  case 'agregar miembro':
		              location.path('/addmember');
		              break;
		          case 'create charge':
				  case 'crear cargos':
		              location.path('/createcharge');
		              break;
		          case 'enter collection sheet':
				  case 'hoja de recoleccion':
		              location.path('/entercollectionsheet');
		              break;
		          case 'product mix':
				  case 'producto mixto':
		              location.path('/productmix');
		              break;
		          case 'add product mix':
				  case 'crear producto mixto':
		              location.path('/addproductmix');
		              break;
		          case 'bulk loan reassignment':
				  case 'reasignacion de prestamo en masa':
		              location.path('/bulkloan');
		              break;
		          case 'audit':
				  case 'auditoria':
		              location.path('/audit');
		              break;
		          case 'create accounting closure':
				  case 'crear cierres contables':
		              location.path('/createclosure');
		              break;
		          case 'navigation':
				  case 'navegacion':
		              location.path('/nav/offices');
		              break;
		          case 'accounting':
				  case 'contabilidad':
		              location.path('/accounting');
		              break;
		          case 'organization':
				  case 'organizacion':
		              location.path('/organization');
		              break;
		          case 'system':
				  case 'sistema':
		              location.path('/system');
		              break;
		          case 'system users':
				  case 'usuarios del sistema':
		              location.path('/admin/users');
		              break;
		          default:
		              location.path('/home');
		      }
            }

        }

    });
    mifosX.ng.application.controller('ExpertSearchController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ExpertSearchController]).run(function ($log) {
        $log.info("ExpertSearchController initialized");
    });
}(mifosX.controllers || {}));
