class Cl_Curso {
  constructor(curso, costo, estudiantesAdmitir) {
      this.curso = curso;
      this.costo = costo;
      this.estudiantesAdmitir = estudiantesAdmitir;
      this.contIntegrantesMat = 0;
      this.contIntegrantesFi = 0;
      this.contIntegrantesQui = 0;
  }
}

class CL_mAspirante extends Cl_Curso {
  constructor(curso, costo, estudiantesAdmitir, nombre, condicion, cursoCursar) {
      super(curso, costo, estudiantesAdmitir);
      this.nombre = nombre;
      this.condicion = condicion;
      this.cursoCursar = cursoCursar;
  }

  descuento() {
      return this.costo * (this.condicion === "ii" ? 0.5 : 0);
  }

  disponible() {
      if (this.cursoCursar === "1" && this.contIntegrantesMat > this.estudiantesAdmitir) {
          return false;
      } else if (this.cursoCursar === "2" && this.contIntegrantesFi > this.estudiantesAdmitir) {
          return false;
      } else if (this.cursoCursar === "3" && this.contIntegrantesQui > this.estudiantesAdmitir) {
          return false;
      }
      return true;
  }

  tpagar() {
      if (!this.disponible()) {
          return "No hay cupos";
      }
      return this.costo - this.descuento();
  }
}

class CL_mAcademia {
  constructor() {
      this.arrayAspirantes = [];
  }

  agregar(aspirante) {
      this.arrayAspirantes.push(aspirante);
  }

  eliminar(nombre) {
      for (let pos = 0; pos < this.arrayAspirantes.length; pos++) {
          if (this.arrayAspirantes[pos].nombre === nombre) {
              this.arrayAspirantes.splice(pos, 1);
              pos--;
          }
      }
  }

  existe(nombre) {
      let existe = false;
      this.arrayAspirantes.forEach((aspirante) => {
          if (aspirante.nombre === nombre) existe = true;
      });
      return existe;
  }

  totalInscritos() {
      let m = 0, f = 0, q = 0;
      this.arrayAspirantes.forEach((aspirante) => {
          aspirante.cursoCursar === "1" ? m++ : aspirante.cursoCursar === "2" ? f++ : q++;
      });
      return [m, f, q];
  }

  montoDescontado() {
      let descuento = 0;
      this.arrayAspirantes.forEach((aspirante) => {
          if (aspirante.condicion === "ii") {
              descuento += aspirante.descuento();
          }
      });
      return descuento;
  }
}

class Cl_vista {
  constructor(app) {
      this.app = app;
  }
}

class Cl_vAspirante extends Cl_vista {
  constructor(app) {
      super(app);
      this.btAgregar = document.getElementById("vAcademia_btAgregar");
      this.btEliminar = document.getElementById("vAcademia_btEliminar");
      this.rptrAcademia = document.getElementById("vAcademia_rptrAspirantes");
      this.tmpltDivAspirante = this.rptrAcademia.children[0].cloneNode(true);
      this.lblTotalInscritos = document.getElementById("vAcademia_lblTotalInscritos");
      this.lblmontoDescontado = document.getElementById("vAcademia_lblmontoDescontado");

      this.btAgregar.addEventListener("click", () => {
          this.agregar();
      });

      this.btEliminar.addEventListener("click", () => {
          this.eliminar();
      });
  }

  agregar() {
      let aspirante = new CL_mAspirante();
      aspirante.curso = prompt("Nombre del curso:");
      aspirante.costo = +prompt("Costo del curso:");
      aspirante.estudiantesAdmitir = +prompt("Cantidad de estudiantes a admitir:");
      aspirante.condicion = prompt("Condicion: i - Normal / ii - Becado:");
      aspirante.cursoCursar = prompt("1-Matematicas    2-Fisica   3-Quimica");
      aspirante.nombre = prompt("Nombre del aspirante:");

      
      if (aspirante.disponible()) {
          this.app.mAcademia.agregar(aspirante);
          this.listarInfo();
      } else {
          alert("No hay cupos disponibles");
      }
  }

  eliminar() {
      let nombre = prompt("Nombre del aspirante a eliminar:");
      if (this.app.mAcademia.existe(nombre)) {
          if (confirm(`¿Seguro de eliminar el aspirante ${nombre}?`)) {
              this.app.mAcademia.eliminar(nombre);
              this.listarInfo();
          }
      } else alert(`No existe el aspirante con nombre ${nombre}`);
  }

  listarInfo() {
      while (this.rptrAcademia.children[0] !== undefined) {
          this.rptrAcademia.children[0].remove();
      }

      this.app.mAcademia.arrayAspirantes.forEach((aspirante) => {
          let htmlAspirante = this.tmpltDivAspirante.cloneNode(true);
          htmlAspirante.getElementsByClassName("vAcademia_curso")[0].innerHTML = aspirante.curso;
          htmlAspirante.getElementsByClassName("vAcademia_costo")[0].innerHTML = aspirante.costo;
          htmlAspirante.getElementsByClassName("vAcademia_estudiantesAdmitir")[0].innerHTML = aspirante.estudiantesAdmitir;
          htmlAspirante.getElementsByClassName("vAcademia_nombre")[0].innerHTML = aspirante.nombre;
          htmlAspirante.getElementsByClassName("vAcademia_condicion")[0].innerHTML = aspirante.condicion;
          htmlAspirante.getElementsByClassName("vAcademia_cursoCursar")[0].innerHTML = this.getCursoCursarText(aspirante.cursoCursar);
          htmlAspirante.getElementsByClassName("vAcademia_descuento")[0].innerHTML = aspirante.descuento();
          htmlAspirante.getElementsByClassName("vAcademia_tpagar")[0].innerHTML = aspirante.tpagar();
          this.rptrAcademia.appendChild(htmlAspirante);
      });

      const [matematicas, fisica, quimica] = this.app.mAcademia.totalInscritos();
      this.lblTotalInscritos.innerHTML = `Matematicas: ${matematicas}, Fisica: ${fisica}, Quimica: ${quimica}`;
      this.lblmontoDescontado.innerHTML = this.app.mAcademia.montoDescontado();
  }

  getCursoCursarText(cursoCursar) {
      switch (cursoCursar) {
          case "1":
              return "Matematicas";
          case "2":
              return "Fisica";
          case "3":
              return "Quimica";
          default:
              return "--";
      }
  }
}

class Cl_app {
  constructor() {
      this.mAcademia = new CL_mAcademia();
      this.Cl_vAspirante = new Cl_vAspirante(this);
      this.cargarAspirantesIniciales();
  }

  cargarAspirantesIniciales() {
      this.mAcademia.agregar(new CL_mAspirante("Matematicas", 20, 3, "Juan", "i", "1"));
      this.mAcademia.agregar(new CL_mAspirante("Matematicas", 20, 3, "Jose", "ii", "1"));
      this.mAcademia.agregar(new CL_mAspirante("Fisica", 30, 2, "Maria", "i", "2"));
      this.mAcademia.agregar(new CL_mAspirante("Fisica", 30, 2, "Petra", "ii", "2"));
      this.mAcademia.agregar(new CL_mAspirante("Quimica", 15, 1, "Mario", "i", "3"));
      this.Cl_vAspirante.listarInfo();
  }
}

let app = new Cl_app();
