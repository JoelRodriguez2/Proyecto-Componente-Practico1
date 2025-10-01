import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const initialState = {
    dni: "",
    nombres: "",
    apellidos: "",
    fechaNacimiento: "",
    genero: "",
    ciudad: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [forms, setForms] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Obtener todos los registros
  const getForms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/forms");
      if (!res.ok) throw new Error("Error al obtener registros");
      const data = await res.json();
      setForms(data);
    } catch (err) {
      console.error("getForms:", err);
    }
  };

  useEffect(() => {
    getForms();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.dni) newErrors.dni = "DNI es obligatorio";
    if (!formData.nombres) newErrors.nombres = "Nombres son obligatorios";
    if (!formData.apellidos) newErrors.apellidos = "Apellidos son obligatorios";
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = "Fecha de nacimiento es obligatoria";
    if (!formData.genero) newErrors.genero = "Seleccione un género";
    if (!formData.ciudad) newErrors.ciudad = "Seleccione una ciudad";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditing && editId) {
        // UPDATE
        const res = await fetch(`http://localhost:5000/api/form/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Error al actualizar");
        // opcional: const updated = await res.json();
        setIsEditing(false);
        setEditId(null);
        setFormData(initialState);
      } else {
        // CREATE
        const res = await fetch("http://localhost:5000/api/form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Error al crear");
        setFormData(initialState);
      }
      await getForms();
      setErrors({});
      alert(isEditing ? "Registro actualizado" : "Formulario guardado correctamente");
    } catch (err) {
      console.error("handleSubmit:", err);
      alert("Hubo un error al guardar. Revisa la consola.");
    }
  };

  // Preparar formulario para editar
  const editForm = (form) => {
    setIsEditing(true);
    setEditId(form._id);
    setFormData({
      dni: form.dni || "",
      nombres: form.nombres || "",
      apellidos: form.apellidos || "",
      fechaNacimiento: form.fechaNacimiento || "",
      genero: form.genero || "",
      ciudad: form.ciudad || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData(initialState);
    setErrors({});
  };

  // Eliminar registro
  const deleteForm = async (id) => {
    if (!confirm("¿Eliminar este registro?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/form/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar");
      await getForms();
    } catch (err) {
      console.error("deleteForm:", err);
      alert("No se pudo eliminar el registro.");
    }
  };

  return (
    <div className="App">
      <h1>Formulario React</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={formData.dni}
          onChange={handleChange}
        />
        {errors.dni && <p className="error">{errors.dni}</p>}

        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={formData.nombres}
          onChange={handleChange}
        />
        {errors.nombres && <p className="error">{errors.nombres}</p>}

        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
        />
        {errors.apellidos && <p className="error">{errors.apellidos}</p>}

        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
        />
        {errors.fechaNacimiento && <p className="error">{errors.fechaNacimiento}</p>}

        <div className="form-group">
          <label className="label-center">Género:</label>
          <div className="radio-group-horizontal">
            <label>
              <input
                type="radio"
                name="genero"
                value="M"
                checked={formData.genero === "M"}
                onChange={handleChange}
              /> Masculino
            </label>
            <label>
              <input
                type="radio"
                name="genero"
                value="F"
                checked={formData.genero === "F"}
                onChange={handleChange}
              /> Femenino
            </label>
          </div>
          {errors.genero && <p className="error">{errors.genero}</p>}
        </div>

        <select name="ciudad" value={formData.ciudad} onChange={handleChange}>
          <option value="">Seleccione ciudad</option>
          <option value="Quito">Quito</option>
          <option value="Guayaquil">Guayaquil</option>
          <option value="Milagro">Milagro</option>
        </select>
        {errors.ciudad && <p className="error">{errors.ciudad}</p>}

        <button type="submit">{isEditing ? "Actualizar" : "Guardar"}</button>
        {isEditing && (
          <button type="button" style={{ marginTop: "8px" }} onClick={cancelEdit}>
            Cancelar
          </button>
        )}
      </form>

      {/* Lista de registros (tabla simple) */}
      <h2 style={{ marginTop: 30 }}>Registros</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>DNI</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Nombres</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Apellidos</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Fecha Nac.</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Género</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Ciudad</th>
              <th style={{ border: "1px solid #ccc", padding: 8 }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {forms.map((f) => (
              <tr key={f._id}>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{f.dni}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{f.nombres}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{f.apellidos}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{f.fechaNacimiento}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{f.genero}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>{f.ciudad}</td>
                <td style={{ border: "1px solid #ccc", padding: 8 }}>
                  <button onClick={() => editForm(f)} style={{ marginRight: 6 }}>Editar</button>
                  <button onClick={() => deleteForm(f._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {forms.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: 12 }}>No hay registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

