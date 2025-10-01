<template>
  <div class="app">
    <h1>Formulario Vue</h1>

    <form @submit.prevent="handleSubmit" class="formulario">
      <input type="text" v-model="formData.dni" placeholder="DNI" />
      <p v-if="errors.dni" class="error">{{ errors.dni }}</p>

      <input type="text" v-model="formData.nombres" placeholder="Nombres" />
      <p v-if="errors.nombres" class="error">{{ errors.nombres }}</p>

      <input type="text" v-model="formData.apellidos" placeholder="Apellidos" />
      <p v-if="errors.apellidos" class="error">{{ errors.apellidos }}</p>

      <input type="date" v-model="formData.fechaNacimiento" />
      <p v-if="errors.fechaNacimiento" class="error">{{ errors.fechaNacimiento }}</p>

      <div class="form-group">
        <label class="label-center">Género:</label>
        <div class="radio-group-horizontal">
          <label>
            <input type="radio" value="M" v-model="formData.genero" /> Masculino
          </label>
          <label>
            <input type="radio" value="F" v-model="formData.genero" /> Femenino
          </label>
        </div>
        <p v-if="errors.genero" class="error">{{ errors.genero }}</p>
      </div>

      <select v-model="formData.ciudad">
        <option value="">Seleccione ciudad</option>
        <option value="Quito">Quito</option>
        <option value="Guayaquil">Guayaquil</option>
        <option value="Milagro">Milagro</option>
      </select>
      <p v-if="errors.ciudad" class="error">{{ errors.ciudad }}</p>

      <button type="submit">{{ isEditing ? 'Actualizar' : 'Guardar' }}</button>
      <button type="button" v-if="isEditing" @click="cancelEdit">Cancelar</button>
    </form>

    <h2>Registros</h2>
    <table>
      <thead>
        <tr>
          <th>DNI</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Fecha Nac.</th>
          <th>Género</th>
          <th>Ciudad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="form in forms" :key="form._id">
          <td>{{ form.dni }}</td>
          <td>{{ form.nombres }}</td>
          <td>{{ form.apellidos }}</td>
          <td>{{ form.fechaNacimiento }}</td>
          <td>{{ form.genero }}</td>
          <td>{{ form.ciudad }}</td>
          <td>
            <button class="edit-btn" @click="editForm(form)">Editar</button>
            <button class="delete-btn" @click="deleteForm(form._id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      forms: [],
      formData: {
        dni: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: '',
        ciudad: ''
      },
      errors: {},
      isEditing: false,
      editId: null
    };
  },
  methods: {
    async getForms() {
      const res = await fetch('http://localhost:5000/api/forms');
      this.forms = await res.json();
    },
    validateForm() {
      const errs = {};
      if (!this.formData.dni) errs.dni = 'DNI es obligatorio';
      if (!this.formData.nombres) errs.nombres = 'Nombres son obligatorios';
      if (!this.formData.apellidos) errs.apellidos = 'Apellidos son obligatorios';
      if (!this.formData.fechaNacimiento) errs.fechaNacimiento = 'Fecha de nacimiento es obligatoria';
      if (!this.formData.genero) errs.genero = 'Seleccione un género';
      if (!this.formData.ciudad) errs.ciudad = 'Seleccione una ciudad';
      return errs;
    },
    async handleSubmit() {
      this.errors = this.validateForm();
      if (Object.keys(this.errors).length) return;

      if (this.isEditing) {
        await fetch(`http://localhost:5000/api/form/${this.editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData)
        });
        this.isEditing = false;
        this.editId = null;
      } else {
        await fetch('http://localhost:5000/api/form', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData)
        });
      }

      this.formData = {
        dni: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: '',
        ciudad: ''
      };
      this.getForms();
    },
    editForm(form) {
      this.isEditing = true;
      this.editId = form._id;
      this.formData = { ...form };
    },
    cancelEdit() {
      this.isEditing = false;
      this.editId = null;
      this.formData = {
        dni: '',
        nombres: '',
        apellidos: '',
        fechaNacimiento: '',
        genero: '',
        ciudad: ''
      };
    },
    async deleteForm(id) {
      await fetch(`http://localhost:5000/api/form/${id}`, { method: 'DELETE' });
      this.getForms();
    }
  },
  mounted() {
    this.getForms();
  }
};
</script>

<style>
/* Fondo general y centrado */
.app {
  max-width: 600px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
  background-color: #fef6f0; /* pastel suave */
  padding: 20px;
  border-radius: 10px;
}

/* Títulos */
h1, h2 {
  text-align: center;
  color: #333;
}

/* Formulario */
.formulario {
  background: #fff0f5; /* pastel lila suave */
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 0 5px rgba(0,0,0,0.05);
}

/* Inputs y select */
input, select, button {
  width: 100%;
  padding: 8px;
  margin: 6px 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  background-color: #fffaf0; /* pastel claro */
  color: #333;
}

/* Botones */
button {
  cursor: pointer;
  background-color: #a8dadc; /* pastel azul */
  color: #333;
  border: none;
  font-weight: bold;
  margin-top: 5px;
}

button.edit-btn {
  background-color: #ffb6b9; /* pastel rosa */
  color: #333;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  margin-right: 5px;
}

button.delete-btn {
  background-color: #f6c90e; /* pastel amarillo */
  color: #333;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
}

/* Radio buttons */
.radio-group-horizontal {
  display: flex;
  justify-content: center;
  gap: 15px;
  color: #333; /* color oscuro para que se note */
  font-weight: normal;
}
.label-center {
  display: block;
  text-align: center;
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
}

/* Errores */
.error {
  color: #e63946; /* rojo pastel */
  font-size: 0.85em;
  margin-top: 2px;
  margin-bottom: 5px;
}

/* Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #fffaf0;
}

th, td {
  padding: 8px;
  border: 1px solid #ccc;
  text-align: center;
  color: #333; /* color oscuro para todos los textos de la tabla */
}

th {
  background-color: #a8dadc;
  font-weight: bold;
}
</style>
