const Modulo_BD = require("../models/modulos_");
const scdl = require("soundcloud-downloader").default;
const fs = require("fs");
const path = require("path");
const Swal = require("sweetalert2");
//const {getStreamUrls} = require('mixcloud-audio')

exports.dashboard = (req, res) => {
 const user = res.locals.user;
 const tipo_user = user.tipo
 if (user.tipo == "Cliente") {
  res.redirect('/dash_cliente')
}

 if (tipo_user == "Administrador") {
  Modulo_BD.publicaciones(user.id).then((respuesta) =>{
    let publicaciones = JSON.parse(respuesta)
    console.log(user);
    res.render("dashboard", {
      pageName: "Dashboard",
      dashboardPage: true,
      dashboard: true,
      publicaciones,
      admin:true,
      user,
    });
  })
 }else{
  Modulo_BD.publicaciones(user.id).then((respuesta) =>{
    let publicaciones = JSON.parse(respuesta)
    console.log(user);
    Modulo_BD.WalletbyIduser(user.id).then((resultado) => {
          
      let parsed_wallet = JSON.parse(resultado)[0];
      console.log(parsed_wallet);
      Modulo_BD.VentasbyIduser(user.id).then((resultado_ventas) => { 
        let parsed_ventas = JSON.parse(resultado_ventas);
        let contar_ventas = parsed_ventas.length
        console.log(contar_ventas);

    res.render("dashboard", {
      pageName: "Dashboard",
      dashboardPage: true,
      dashboard: true,
      publicaciones,
      parsed_wallet,
      contar_ventas,
      user,
    })
  })
    });
  })
 }

};

  exports.micuenta = (req, res) => {
    const user = res.locals.user;
    let tipo = user.tipo
    let dash_cliente = false
    if (tipo == 'Cliente') {
      Modulo_BD.ClientebyId(user.id).then((respuesta)=>{
        let parse_cliente = JSON.parse(respuesta)[0]
        console.log(parse_cliente)
         res.render("micuenta", {
     pageName: "Mi cuenta",
     dashboardPage: true,
     dash_cliente:true,
     micuenta:true,
     parse_cliente
     //layout: "page-form",
     //user,
   });
      })
      
    }else{
      let admin = false
  
      Modulo_BD.SucursalesbyuserEncargado(user.id).then((data)=>{
        let encargados_micuenta = ""
        if (user.tipo == "Administrador") {
          admin = true;

        }else{
          let sucursales = JSON.parse(data)[0];
          encargados_micuenta = sucursales.encargados;
        }
      
      res.render("micuenta", {
        pageName: "Mi cuenta",
        dashboardPage: true,
        dash_cliente,
        micuenta:true,
        encargados_micuenta, admin
        //layout: "page-form",
        //user,
      });
    })
    }
    
   //console.log(req);
  
 };


 //CLIENTE DATOS
 exports.guardar_cliente = (req, res) => {
  const user = res.locals.user;
  const { userid,departamento,
    distrito,
    direccion,
    telefono } = req.body;

   Modulo_BD.guardar_Client(userid,departamento, distrito,direccion,telefono).then((respuesta) =>{
    
     console.log(respuesta)
      res.redirect('/micuenta')

   })   
 };





 exports.minegocio = (req, res) => {
  const user = res.locals.user;
   console.log(user);
   let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  let admin = false
  if (user.tipo == "Administrador") {
    admin = true;
    Modulo_BD.SucursalesAll().then((respuesta) =>{
      let sucursales = JSON.parse(respuesta)
      console.log(sucursales)
      //console.log(sucursales[0].encargados);
       res.render("minegocio", {
      pageName: "Mi cuenta",
      dashboardPage: true,
      minegocio:true,
      sucursales,
      user,msg,logo, admin
      //admin_dash1: true,
      //layout: "page-form",
      //user,
    });
    })  

  }else{
    Modulo_BD.Sucursalesbyuser(user.id).then((respuesta) =>{
      let sucursales = JSON.parse(respuesta)
      console.log(sucursales)
      console.log(sucursales[0].encargados);
       res.render("minegocio", {
      pageName: "Mi cuenta",
      dashboardPage: true,
      minegocio:true,
      sucursales,
      user,msg,logo, admin
      //admin_dash1: true,
      //layout: "page-form",
      //user,
    });
    })  
  }
 
 };


 exports.encargados = (req, res) => {
  const user = res.locals.user;
  const id_sucursal = req.params.id_sucursal
   //console.log(req);
   let admin = false
  if (user.tipo == "Administrador") {
    admin = true;
  }
   Modulo_BD.consultarSucursalesbyId(id_sucursal).then((respuesta) =>{
     let sucursales = JSON.parse(respuesta)[0]
     let encargados = sucursales.encargados
     console.log(sucursales)

      res.render("encargados", {
     pageName: "Mi cuenta",
     dashboardPage: true,
     minegocio:true,
     sucursales,
     encargados,
     logo:true,
     admin
     //admin_dash1: true,
     //layout: "page-form",
     //user,
   });

   })   
 };

 exports.agregar_encargados = (req, res) => {
  const user = res.locals.user;
  const { id_sucursal,
    nombre,
    apellido,
    correo,
    telefono,tipo } = req.body;

   Modulo_BD.guardar_encargardo(id_sucursal,nombre,apellido, correo,telefono, tipo).then((respuesta) =>{
    
     console.log(respuesta)
      res.redirect('/encargados/'+id_sucursal)

   })   
 };

 exports.delete_encargado = (req, res) => {
  const user = res.locals.user;
  let id_encargado = req.params.id_encargado
  let id_sucursal = req.params.id_sucursal

   Modulo_BD.eliminar_encargado(id_encargado).then((respuesta) =>{
    
     console.log(respuesta)
      res.redirect('/encargados/'+id_sucursal)

   })   
 };
 exports.crear_sucursal = (req, res) => {
  const user = res.locals.user;
   //console.log(req);
   let admin = false
  if (user.tipo == "Administrador") {
    admin = true;
  }
     res.render("editar_suc_enc", {
     pageName: "Mi cuenta",
     dashboardPage: true,
     minegocio:true,
     logo:true,
     sucursal_create:true,
     user,admin
   });  
 };
 exports.guardar_sucursal = (req, res) => {
  const user = res.locals.user;
  const { id_usuario,departamento,
    distrito,
    direccion,
    telefono,nombre_local,distritos_atendidos,dias_laborables,  desde, hasta } = req.body;

   Modulo_BD.guardar_sucursal(id_usuario,departamento, distrito,direccion,telefono,nombre_local,distritos_atendidos,dias_laborables,  desde, hasta).then((respuesta) =>{
    
     console.log(respuesta)
      res.redirect('/minegocio')

   })   
 };
 exports.delete_sucursal = (req, res) => {
  const user = res.locals.user;
  let tipo = req.params.tipo
  let id_sucursal = req.params.id
if (tipo == "Principal") {
  let msg = "No es posible eliminar una sucursal Principal"
  res.redirect('/minegocio/'+msg)
}else{
  Modulo_BD.eliminar_sucursal(id_sucursal).then((respuesta) =>{
    
     console.log(respuesta)
  let msg = "Sucursal eliminada con exito"
  res.redirect('/minegocio/'+msg)

   }) 
}
     
 };

 exports.editar_sucursal = (req, res) => {
  const user = res.locals.user;
  const id_sucursal = req.params.id_sucursal
   //console.log(req);
   let admin = false
  if (user.tipo == "Administrador") {
    admin = true;
  }
   Modulo_BD.consultarSucursalesbyId(id_sucursal).then((respuesta) =>{
     let sucursales = JSON.parse(respuesta)[0]
     let encargados = sucursales.encargados
     console.log(sucursales)

     let distritos = (sucursales.distritos).split(',')
      res.render("editar_suc_enc", {
     pageName: "Mi cuenta",
     dashboardPage: true,
     minegocio:true,
     sucursales,
     encargados,
     logo:true,
     distritos,
     sucursal_edit:true, admin
   });

   })   
 };

 exports.guardar_editar_sucursal = (req, res) => {
  const user = res.locals.user;
  console.log(req.body)
  
  const { id_sucursal,departamento,
    distrito,
    direccion,
    telefono, nombre_local, distritos_atendidos, dias_laborables,  desde, hasta} = req.body;


   Modulo_BD.guardar_editar_sucursal(id_sucursal,departamento, distrito,direccion,telefono, nombre_local, distritos_atendidos, dias_laborables,  desde, hasta).then((respuesta) =>{
    
     console.log(respuesta)
     let msg ="Se actualizó con éxito la sucursal indicada"
     res.redirect('/minegocio/'+msg)

   })   
 };

 exports.editar_encargado = (req, res) => {
  const user = res.locals.user;
  let id_encargado = req.params.id_encargado
  let id_sucursal = req.params.id_sucursal
  let admin = false
  if (user.tipo == "Administrador") {
    admin = true;
  }
  Modulo_BD.consultarEmpleadobyId(id_encargado).then((respuesta) =>{
    let encargado = JSON.parse(respuesta)[0]
    console.log(encargado)

     res.render("editar_suc_enc", {
    pageName: "Mi cuenta",
    dashboardPage: true,
    minegocio:true,
    encargado,
    logo:true,
    encargados_edit:true,
    admin
    //admin_dash1: true,
    //layout: "page-form",
    //user,
  });

  })  
 };

 exports.guardar_editar_encargardo = (req, res) => {
  const user = res.locals.user;
  const { id_empleado,
    nombre,
    apellido,
    correo,
    tipo,
    telefono} = req.body;

   Modulo_BD.guardar_editar_encargardo(id_empleado,
    nombre,   apellido,    correo, telefono, tipo).then((respuesta) =>{
      if (tipo == "Encargado") {
        res.redirect('/micuenta')
      }else{
        res.redirect('/minegocio')
      }
      

   })   
 };

 exports.actualizar_negocio = (req, res) => {
  const user = res.locals.user;
  const { userid,
    nombre,
    telefono,
    descripcion,
    banco,
    cuenta,
    photo1 } = req.body;

   Modulo_BD.actualizarnegocio(userid,
    nombre,
    telefono,
    descripcion,
    banco,
    cuenta,
    photo1).then((respuesta) =>{

      req.user.name = nombre;
      req.user.telefono = telefono;
      req.user.descripcion = descripcion;
      req.user.banco = banco;
      req.user.cuenta = cuenta;
      req.user.photo = photo1;


     let msg ="Se actualizó con éxito su negocio"
      res.redirect('/minegocio/'+msg)

   })   
 };

//PERFILES
exports.perfiles = (req, res) => {
  var id_perfil = req.params.id
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }  
  const user = res.locals.user;
  let admin = false
  if (user.tipo == "Administrador") {
    admin = true;
  }
  Modulo_BD.Sucursalesbyuser(id_perfil).then((respuesta) =>{
    let sucursales = JSON.parse(respuesta)
    Modulo_BD.UsuariobyId(id_perfil).then((data) =>{
      let user = JSON.parse(data)[0]
     console.log(sucursales)
    //console.log(req);
     res.render("perfiles", {
     pageName: "Perfiles",
     sucursales,
     perfiles_ext:true,
     logo:true, msg,user,admin
   }); 
  }) 
  })   
   
 };

 //MIS PUBLICACIONES
 exports.mispublicaciones = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  let admin = false
if (user.tipo == "Administrador") {
  admin = true;
}
  Modulo_BD.publicaciones(user.id).then((respuesta) =>{
    let publicaciones = JSON.parse(respuesta)

     console.log(publicaciones)
    //console.log(req);
     res.render("mispublicaciones", {
     pageName: "Mis Publicaciones",
     dashboardPage: true,
     publicaciones,
     mispublicaciones:true,
     logo:true, msg,
     user,
     admin
   });  
  })   
   
 };
 exports.crearpublicacion = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  let admin = false
if (user.tipo == "Administrador") {
  admin = true;
}
   //console.log(req);
   Modulo_BD.Sucursalesbyuser(user.id).then((respuesta) =>{
    let sucursales = JSON.parse(respuesta)
    console.log(sucursales)
    for (let i = 0; i < sucursales.length; i++) {
      if (sucursales[i].tipo == "Principal") {
        var principal = sucursales[i]
      }      
    }
    Modulo_BD.categoriasAct().then((cat) =>{
      let categorias = JSON.parse(cat)
    //console.log(principal)

    Modulo_BD.configuraciones().then((config) =>{
      let configuracion_ = JSON.parse(config)
    console.log(configuracion_)
    for (let i = 0; i < configuracion_.length; i++) {
      if (configuracion_[i].nombre == "Comisión") {
        var comision = configuracion_[i]
      }      
    }
     res.render("mispublicaciones", {
     pageName: "Crear publicacion",
     sucursales,
     comision,
     principal,
     categorias,
     dashboardPage: true,
     crear_publicacion:true,
     logo:true, msg,
     user,
     admin,
   }); 
  })
  }) 
  })
 };

 exports.guardar_publicacion = (req, res) => {
  const user = res.locals.user;
  const {userid, photo,  desde,hasta, titulo, precio,billetera, categoria, estado,  descripcion, condiciones,preparacion, ejecucion,sucursales,empleados,costo_domicilio } = req.body;
  console.log(sucursales + 'Empleados:'+empleados)

   Modulo_BD.guardar_publicacion(userid, photo,  desde,hasta, titulo, precio,billetera, categoria, estado,  descripcion, condiciones,preparacion, ejecucion,sucursales,empleados,costo_domicilio).then((respuesta) =>{
    
     console.log(respuesta)
     let msg="Se creó con exito la publicación"
      res.redirect('/mispublicaciones/'+msg)

   })   
 };

 exports.delete_publicacion = (req, res) => {
  const user = res.locals.user;
  let tipo = req.params.tipo
  let id_publicacion = req.params.id
if (tipo == "Principal") {
  let msg = "No es posible eliminar una publicacion Principal"
  res.redirect('/minegocio/'+msg)
}else{
  Modulo_BD.eliminar_publicacion(id_publicacion).then((respuesta) =>{
    
     console.log(respuesta)
  let msg = "publicacion eliminada con exito"
  res.redirect('/mispublicaciones/'+msg)

   }) 
}    
 };

 exports.editar_publicacion = (req, res) => {
  const user = res.locals.user;
  let id_publicacion = req.params.id
let admin = false
if (user.tipo == "Administrador") {
  admin = true;
}
  Modulo_BD.publicacionesbyId(id_publicacion).then((data) =>{
    let publicacion = JSON.parse(data)[0]
    console.log(publicacion)
    Modulo_BD.Sucursalesbyuser(user.id).then((respuesta) =>{
      let sucursales = JSON.parse(respuesta)
      Modulo_BD.categoriasAct().then((cat) =>{
        let categorias = JSON.parse(cat)
        Modulo_BD.configuraciones().then((config) =>{
          let configuracion_ = JSON.parse(config)
        console.log(configuracion_)
        for (let i = 0; i < configuracion_.length; i++) {
          if (configuracion_[i].nombre == "Comisión") {
            var comision = configuracion_[i]
          }      
        }
     res.render("mispublicaciones", {
    pageName: "Mi cuenta",
    dashboardPage: true,
    sucursales,publicacion,
    comision,
    logo:true,
    categorias,
    editar_publicacion:true,
    admin
    //admin_dash1: true,
    //layout: "page-form",
    //user,
  });
})
})
})

  })  
 };

 exports.guardar_editar_publicacion = (req, res) => {
  const user = res.locals.user;
  const {id_publicacion,userid, photo,  desde,hasta, titulo, precio,billetera, categoria, estado,  descripcion, condiciones,preparacion, ejecucion,sucursales,empleados,costo_domicilio } = req.body;
  console.log(sucursales + 'Empleados:'+empleados)

   Modulo_BD.guardaredit_publicacion(id_publicacion,userid, photo,  desde,hasta, titulo, precio,billetera, categoria, estado,  descripcion, condiciones,preparacion, ejecucion,sucursales,empleados,costo_domicilio).then((respuesta) =>{
    
     console.log(respuesta)
     let msg="Se acrualizó con exito la publicación"
      res.redirect('/mispublicaciones/'+msg)

   })   
 };



  //MIS VENTAS
  exports.misventas = (req, res) => {
    const user = res.locals.user;
    var photo = req.user.photo;
    let notPhoto = true;
    if (photo == "0") {
      notPhoto = false;
    }
    let msg = false;
    if (req.params.msg) {
      msg = req.params.msg;
    }
    const tipo_user = user.tipo

 if (tipo_user == "Administrador") {
  
    Modulo_BD.VentasAll().then((resultado_ventas) => { 
    let parsed_ventas = JSON.parse(resultado_ventas);
    console.log(parsed_ventas);
    
    res.render("ventas", {
      pageName: "Ventas",
      ventas: true,
      dashboardPage: true,            
      msg,
      parsed_ventas,
      user,admin:true
  })
});

 }else{
  Modulo_BD.WalletbyIduser(user.id).then((resultado) => {
    let parsed_wallet = JSON.parse(resultado)[0];
    console.log(parsed_wallet);
    let cont = parsed_wallet.length;
    Modulo_BD.VentasbyIduser(user.id).then((resultado_ventas) => { 
    let parsed_ventas = JSON.parse(resultado_ventas);
    console.log(parsed_ventas);
    
    Hoy = new Date(); //Fecha actual del sistema
    var AnyoHoy = Hoy.getFullYear();
    var MesHoy = ('0' + (Hoy.getMonth()+1)).slice(-2)
    var DiaHoy = Hoy.getDate();
    var hora_actual = Hoy.getHours()+':'+ Hoy.getMinutes()

    console.log(hora_actual)
    console.log(AnyoHoy)
    console.log(MesHoy)
    console.log(DiaHoy)

    for (let i = 0; i < parsed_ventas.length; i++) {
      console.log(parsed_ventas[i].Agenda.fecha_agenda)
      var fecha_agendada = parsed_ventas[i].Agenda.fecha_agenda
      var Fecha_aux = fecha_agendada.split("-");
        console.log(Fecha_aux[0]),
        console.log(Fecha_aux[1]),
        console.log(Fecha_aux[2])
      
     
        if (AnyoHoy == Fecha_aux[0] && Fecha_aux[1] == MesHoy && Fecha_aux[2] == DiaHoy) {
          console.log("es hoy");
          if (hora_actual  > parsed_ventas[i].Agenda.hora_cita_hasta) {
            if (parsed_ventas[i].Agenda.estado == "Confirmada") {
              console.log("es hora de realizar");
             return res.redirect('/confirmar_venta/'+parsed_ventas[i].id+'/'+parsed_ventas[i].estado+'/'+parsed_ventas[i].publicacione.billetera+'/'+parsed_ventas[i].AgendaId)
            }
            
          }
        } else {
          console.log("hay fecha");
        }
    }
    res.render("ventas", {
      pageName: "Mis Ventas",
      ventas: true,
      dashboardPage: true,            
      msg,            
      parsed_wallet,
      parsed_ventas,
      user,
    });
  })
});
 }
       
  };
  
  exports.confirmar_venta = (req, res) => {
    const user = res.locals.user;
    var venta_id = req.params.id;
    var billetera = req.params.billetera;
    var estado = req.params.estado;
    var id_agenda = req.params.id_agenda;

    console.log('id agenda:'+id_agenda)
   
    if (estado == "Confirmada") {
      Modulo_BD.VentabyId_realizada(venta_id, billetera, user.id, id_agenda).then(() => {
      
        let msg = "Se guardo la venta como realizada"
        res.redirect('/ventas/'+msg)
      });
    }else{
      Modulo_BD.VentabyId_confirmar(venta_id, id_agenda).then(() => {
      
      let msg = "Se confirmó la venta con éxito"
      res.redirect('/ventas/'+msg)
    });
    }
    
  };


   //MIS COMPRAS
   exports.miscompras = (req, res) => {
    const user = res.locals.user;
    var photo = req.user.photo;
    let notPhoto = true;
    if (photo == "0") {
      notPhoto = false;
    }
    let msg = false;
    if (req.params.msg) {
      msg = req.params.msg;
    }
    const tipo_user = user.tipo

 
    Modulo_BD.VentasbyIdComprador(user.id).then((resultado_ventas) => { 
    let parsed_ventas = JSON.parse(resultado_ventas);
    console.log(parsed_ventas);

    res.render("compras", {
      pageName: "Mis compras",
      miscompras: true,
      dashboardPage: true,      
      dash_cliente: true,            
      msg,     
      parsed_ventas,
      user,
  })
});
       
  };
  
  exports.confirmar_miscompras = (req, res) => {
    const user = res.locals.user;
    var venta_id = req.params.id;
    var billetera = req.params.billetera;
    var estado = req.params.estado;

    console.log(estado)
   
    if (estado == "Confirmada") {
      Modulo_BD.VentabyId_realizada(venta_id, billetera, user.id).then(() => {
      
        let msg = "Se guardo la venta como realizada"
        res.redirect('/ventas/'+msg)
      });
    }else{
      Modulo_BD.VentabyId_confirmar(venta_id).then(() => {
      
      let msg = "Se confirmó la venta con éxito"
      res.redirect('/ventas/'+msg)
    });
    }
    
  };







//CATEGORIAS
exports.categorias = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  
  Modulo_BD.categorias().then((respuesta) =>{
    let categorias = JSON.parse(respuesta)

     console.log(categorias)
    //console.log(req);
     res.render("categorias", {
     pageName: "Mis categorias",
     dashboardPage: true,
     cate:true,
     categorias,
     logo:true, 
     msg,
     user,
     admin:true,
   });  
  })   
   
 };
 exports.crear_categoria = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }

     res.render("categorias", {
     pageName: "Crear categorias",
     dashboardPage: true,
     crear_cate:true,
     logo:true, 
     msg,
     user,
   });
 };

 exports.guardar_categoria = (req, res) => {
  const {userid,categoria,  estado } = req.body;

   Modulo_BD.guardar_categoria(userid, categoria,  estado).then((respuesta) =>{
 
     let msg="Se creó con exito la categoria"
      res.redirect('/categorias/'+msg)

   })   
 };

 exports.editar_categoria = (req, res) => {
  const user = res.locals.user;
  let id_ct = req.params.id

  Modulo_BD.categoriabyId(id_ct).then((data) =>{
    let categoria = JSON.parse(data)[0]
    console.log(categoria)
     res.render("categorias", {
    pageName: "Mi cuenta",
    dashboardPage: true,
    categoria,
    logo:true,
    editar_categoria:true,
    admin:true,
    //admin_dash1: true,
    //layout: "page-form",
    //user,
})

  })  
 };

 exports.guardar_editar_categoria = (req, res) => {
  const user = res.locals.user;
  const {id_categoria,categoria,  estado } = req.body;

   Modulo_BD.guardaredit_categoria(id_categoria,categoria,  estado, user.id).then((respuesta) =>{
    
     console.log(respuesta)
     let msg="Se actualizó con exito la categoria"
      res.redirect('/categorias/'+msg)

   })   
 };



 //configuraciones
exports.configuraciones = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  
  Modulo_BD.configuraciones().then((respuesta) =>{
    let configuraciones = JSON.parse(respuesta)

     console.log(configuraciones)
    //console.log(req);
     res.render("configuraciones", {
     pageName: "Mis configuraciones",
     config: true,
     dashboardPage: true,
     configuraciones,
     logo:true, 
     msg,
     user,
     admin:true,
   });  
  })   
   
 };
 exports.crear_configuraciones = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }

     res.render("configuraciones", {
     pageName: "Crear configuraciones",
     dashboardPage: true,
     crear_config:true,
     logo:true, 
     msg,
     user,
   });
 };

 exports.guardar_configuraciones = (req, res) => {
  const {userid,configuracion,  estado,valor } = req.body;

   Modulo_BD.guardar_configuraciones(userid, configuracion,  estado,valor).then((respuesta) =>{
 
     let msg="Se creó con exito la configuracion: "+configuracion;
      res.redirect('/configuraciones/'+msg)

   })   
 };

 exports.editar_configuraciones = (req, res) => {
  const user = res.locals.user;
  let id_ct = req.params.id

  Modulo_BD.configuracionesbyId(id_ct).then((data) =>{
    let configuracion_edit = JSON.parse(data)[0]
    console.log(configuracion_edit)
     res.render("configuraciones", {
    pageName: "Mis configuraciones",
    dashboardPage: true,
    configuracion_edit,
    logo:true,
    editar_config:true,
    admin:true,
    //admin_dash1: true,
    //layout: "page-form",
    //user,
})

  })  
 };

 exports.guardar_editar_configuraciones = (req, res) => {
  const user = res.locals.user;
  const {id_configuracion, configuracion, estado,  valor} = req.body;

   Modulo_BD.guardaredit_configuraciones(id_configuracion, configuracion, estado,  valor, user.id).then((respuesta) =>{
    
     console.log(respuesta)
     let msg="Se actualizó con exito la configuracion"
      res.redirect('/configuraciones/'+msg)

   })   
 };


 //PUBLICIDAD

 exports.publicidad = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  
  Modulo_BD.Publicidad().then((respuesta) =>{
    let publicidad = JSON.parse(respuesta)

     console.log(publicidad)
    //console.log(req);
     res.render("publicidad", {
     pageName: "Mis publicidad",
     public: true,
     dashboardPage: true,
     publicidad,
     logo:true, 
     msg,
     user,
     admin:true,
   });  
  })   
   
 };
 exports.crear_publicidad = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }

     res.render("publicidad", {
     pageName: "Crear publicidad",
     dashboardPage: true,
     crear_public:true,
     logo:true, 
     msg,
     user,
   });
 };

 exports.guardar_publicidad = (req, res) => {
  const {userid,nombre,  estado,photo } = req.body;

   Modulo_BD.guardar_publicidad(userid, nombre,  estado,photo).then((respuesta) =>{
 
     let msg="Se creó con exito la publicidad: ";
      res.redirect('/publicidad/'+msg)

   })   
 };

 exports.editar_publicidad = (req, res) => {
  const user = res.locals.user;
  let id_ct = req.params.id

  Modulo_BD.publicidadbyId(id_ct).then((data) =>{
    let edit_publi = JSON.parse(data)[0]
    console.log(edit_publi)
     res.render("publicidad", {
    pageName: "Editar publicidad",
    dashboardPage: true,
    edit_publi,
    logo:true,
    editar_publi:true,
    admin:true,
    //admin_dash1: true,
    //layout: "page-form",
    //user,
})

  })  
 };

 exports.guardar_editar_publicidad = (req, res) => {
  const user = res.locals.user;
  const {id_configuracion, nombre, estado,  photo} = req.body;

   Modulo_BD.guardaredit_publicidad(id_configuracion, nombre, estado,  photo, user.id).then((respuesta) =>{
    
     console.log(respuesta)
     let msg="Se actualizó con exito la publicidad"
      res.redirect('/publicidad/'+msg)

   })   
 };
 exports.delete_public = (req, res) => {
  const user = res.locals.user;
  let tipo = req.params.tipo
  let id_ = req.params.id

  Modulo_BD.eliminar_publicidad(id_).then((respuesta) =>{
    
     console.log(respuesta)
  let msg = "Publicidad eliminada con éxito"
  res.redirect('/publicidad/'+msg)

   })   
 };




 //AYUDA Y TERMINOS Y CONDICIONES
exports.terminos = (req, res) => {
  const user = res.locals.user;
  let msg = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  Modulo_BD.obtenerAyuda().then((resultado) => {
    let parsed_ayuda = JSON.parse(resultado);
    console.log(parsed_ayuda);
    var terminos_ = [];
    var politicas = [];
    for (let i = 0; i < parsed_ayuda.length; i++) {
      if (parsed_ayuda[i].tipo === "Términos y Condiciones") {
        terminos_.push(parsed_ayuda[i]);
      }
      if (parsed_ayuda[i].tipo === "Politicas") {
        politicas.push(parsed_ayuda[i]);
      }
      
    }
    console.log(terminos_[0])
    console.log(politicas[0])
    res.render("ayudas", {
      pageName: "Términos y Políticas",
      dashboardPage: true,
      logo:true, 
      msg,
      user,
      parsed_ayuda,
      admin:true,
      terminos:true,
    });
  })  
};


exports.terminos_save = async (req, res) => {
  const { id_user, tipo, terminos, politicas_privacidad } =  req.body;
  var id_tipo = req.body.id_tipo;
  console.log(terminos);
  if (typeof id_tipo === "undefined") {
    id_tipo = 0;
  }
  //console.log(id_tipo);
  var msg = "";
  Modulo_BD.saveAyuda(
    id_user,
    tipo,
    terminos,
    politicas_privacidad,
    id_tipo
  )
    .then((result) => {
      console.log(result);
      if (result === "0") {
        msg = "Se actualizó con exito el área de ayuda";
      } else {
        msg = "Ayuda guardada con exito";
      }
      res.redirect("/terminos/" + msg);
    })
    .catch((err) => {
      return res.status(500).send("Error actualizando" + err);
    });
};

exports.terminos_page = (req, res) => {
  //const user = res.locals.user;
  let msg = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  Modulo_BD.obtenerAyuda().then((resultado) => {
    let parsed_ayuda = JSON.parse(resultado);
    console.log(parsed_ayuda);
    res.render("terminos", {
      pageName: "Términos y condiciones",
      landingPage: true,
      logo:true, 
      msg,
      parsed_ayuda,
      publicaciones_landing:true,
      terminos:true,
    });
  })  
};
exports.politicas_page = (req, res) => {
  //const user = res.locals.user;
  let msg = false;
  if (req.params.msg) {
    msg = req.params.msg;
  }
  Modulo_BD.obtenerAyuda().then((resultado) => {
    let parsed_ayuda = JSON.parse(resultado);
    console.log(parsed_ayuda);
    res.render("terminos", {
      pageName: "Políticas de privacidad",
      landingPage: true,
      logo:true, 
      msg,
      parsed_ayuda,
      publicaciones_landing:true,
      politicas:true,
    });
  })  
};



 //USUARIOS ADMIN
exports.usuarios_a = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  
  Modulo_BD.UsuariobyAll().then((respuesta) =>{
    let usuarios = JSON.parse(respuesta)

     console.log(usuarios)
    //console.log(req);
     res.render("reg_admin", {
     pageName: "Mis usuarios",
     dashboardPage: true,
     cate:true,
     usuarios,
     logo:true, 
     msg,
     user,
     admin:true,
   });  
  })   
   
 };
 exports.crear_usuarios_a = (req, res) => {
  const user = res.locals.user;
  let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }

     res.render("reg_admin", {
     pageName: "Crear usuario",
     dashboardPage: true,
     logo:true, 
     crea_usuario:true,
     msg,
     user,
   });
 };

 exports.guardar_usuarios_a = (req, res) => {
  const {userid,categoria,  estado } = req.body;

   Modulo_BD.guardar_categoria(userid, categoria,  estado).then((respuesta) =>{
 
     let msg="Se creó con exito la categoria"
      res.redirect('/categorias/'+msg)

   })   
 };

 exports.editar_usuarios_a = (req, res) => {
  const user = res.locals.user;
  let id_ct = req.params.id

  Modulo_BD.UsuariobyId(id_ct).then((data) =>{
    let usuario = JSON.parse(data)[0]
    console.log(usuario)
     res.render("reg_admin", {
    dashboardPage: true,
    usuario,
    logo:true,
    editar_usuario:true,
    admin:true,
    //admin_dash1: true,
    //layout: "page-form",
    //user,
})

  })  
 };

 exports.guardar_editar_usuarios_a = (req, res) => {
  const user = res.locals.user;
  const {id_categoria,categoria,  estado } = req.body;

   Modulo_BD.guardaredit_categoria(id_categoria,categoria,  estado, user.id).then((respuesta) =>{
    
     console.log(respuesta)
     let msg="Se actualizó con exito la categoria"
      res.redirect('/categorias/'+msg)

   })   
 };

 exports.delete_usuarios_a = (req, res) => {
  const user = res.locals.user;
  let tipo = req.params.tipo
  let id_ = req.params.id
  console.log(tipo)
if (tipo == "Principal") {
  let msg = "No es posible eliminar una publicacion Principal"
  res.redirect('/minegocio/'+msg)
}else{
  Modulo_BD.UsuarioDelete(id_).then((respuesta) =>{
    
     console.log(respuesta)
  let msg = "Usuario eliminado con éxito"
  res.redirect('/usuarios_a/'+msg)

   }) 
}    
 };


 //DASH CLIENTE
 exports.dash_cliente = (req, res) => {
  const user = res.locals.user;
   console.log(user);
   let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
   Modulo_BD.publicacionesAll().then((data) =>{
    let publicaciones = JSON.parse(data)
    console.log(publicaciones)
    Modulo_BD.categoriasAct().then((cat) =>{
      let categorias = JSON.parse(cat)
   res.render("dash_cliente", {
     pageName: "Mi cuenta",
     dashboardPage: true,
     dash_cliente: true,
     user,categorias,
     publicaciones,msg
   });
  })
  })
 };

 exports.ver_publicacion = (req, res) => {
  let id_publicacion = req.params.id
  const user = res.locals.user;
  Modulo_BD.publicacionesbyId(id_publicacion).then((data) =>{
    let publicacion = JSON.parse(data)[0]
   // console.log(publicacion)
    let id_user = publicacion.usuarioId;
    Modulo_BD.Sucursalesbyuser(id_user).then((respuesta) =>{
      let sucursales = JSON.parse(respuesta)
     let encargados = sucursales[0].encargados
      Modulo_BD.UsuariobyId(id_user).then((datauser) =>{
        let usuario = JSON.parse(datauser)[0]
        //console.log(user)
        Modulo_BD.AgendaAll().then((data_agenda) =>{
          let data_agenda_p = JSON.parse(data_agenda)

          let fechas_agenda = []
for (let i = 0; i < data_agenda_p.length; i++) {
  fechas_agenda.push(data_agenda_p[i].fecha_agenda);
  
}
console.log(publicacion)
console.log(sucursales)
   res.render("publicacion", {
     pageName: "Mi cuenta",
     dashboardPage: true,
     dash_cliente: true,
     user,publicacion_activa:true,
     publicacion,usuario,
     sucursales,fechas_agenda, encargados
   });
  })
})
})
  
})
 };

 exports.guardar_agenda = (req, res) => {
   console.log(req.body)
   
  const {fecha, id_publicacion,h_desde, h_hasta,id_encargado, lugar_servicio, nombre_del_tercero, telefono_tercero, direccion_tercero,lugar_serv_propio,costo_domicilio} = req.body;
  const user = res.locals.user;
  const f = new Date(fecha);
						f.toLocaleString()
						 
						var Anyo = f.getFullYear();
						var Mes = ('0' + (f.getMonth()+1)).slice(-2)
						var Dia = f.getDate();
							var fecha_ = Anyo+ '-'+Mes+ '-'+Dia
  Modulo_BD.guardar_Agenda(fecha,id_publicacion, h_desde,h_hasta,id_encargado, lugar_servicio, nombre_del_tercero, telefono_tercero, direccion_tercero,lugar_serv_propio).then((data) =>{
    let agenda = JSON.parse(data)
    let id_agenda = agenda.id
console.log(id_agenda)
res.redirect('/pasarela_publicacion/'+id_publicacion+'/'+id_agenda+'/'+costo_domicilio)
})
 };


 //para el landing aca

 exports.negocio_view = (req, res) => {
  const id_negocio = req.params.id;
   let msg = false;
   var logo =false;
  if (req.params.msg) {
    msg = req.params.msg
    logo = true
  }
  
    Modulo_BD.Sucursalesbyuser(id_negocio).then((respuesta) =>{
      let sucursales = JSON.parse(respuesta)
      let principal = []

      for (let i = 0; i < sucursales.length; i++) {
        if (sucursales[i].tipo == "Principal") {
          principal.push(sucursales[i])
        }
        
        
      }
      console.log(sucursales)
      console.log(sucursales.encargados)
       res.render("negocio_view", {
      pageName: "Mi cuenta",
      sucursales, 
      principal,
      layout: "page-form",
      //user,
    });
    }).catch((err) => {
      console.log(err);
    });
 
 };