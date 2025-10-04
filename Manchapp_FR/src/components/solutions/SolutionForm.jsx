import { useState, useEffect } from "react";
import FormField from "../ui/FormField";
import Button from "../ui/Button";

const SolutionForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tiempo_minutos: "",
    dificultad: "",
    categoria_id: "",
    efectividad: "",
    consejos: "",
    ingredientes: [],
    utensilios: [],
    materiales: [],
    precauciones: []
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        titulo: initialData.titulo || "",
        descripcion: initialData.descripcion || "",
        tiempo_minutos: initialData.tiempo_minutos?.toString() || "",
        dificultad: initialData.dificultad || "",
        categoria_id: initialData.categoria_id?.toString() || "",
        efectividad: initialData.efectividad?.toString() || "",
        consejos: initialData.consejos || "",
        ingredientes: initialData.ingredientes || [],
        utensilios: initialData.utensilios || [],
        materiales: initialData.materiales || [],
        precauciones: initialData.precauciones || []
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error al escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMultiSelectChange = (field, values) => {
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = "El título es requerido";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida";
    }

    if (!formData.dificultad) {
      newErrors.dificultad = "La dificultad es requerida";
    }

    if (!formData.categoria_id) {
      newErrors.categoria_id = "La categoría es requerida";
    }

    if (!formData.efectividad) {
      newErrors.efectividad = "La efectividad es requerida";
    }

    if (
      !formData.tiempo_minutos ||
      formData.tiempo_minutos < 1 ||
      formData.tiempo_minutos > 240
    ) {
      newErrors.tiempo_minutos = "El tiempo debe estar entre 1 y 240 minutos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const solutionData = {
        ...formData,
        tiempo_minutos: parseInt(formData.tiempo_minutos),
        categoria_id: parseInt(formData.categoria_id),
        efectividad: parseInt(formData.efectividad)
      };
      onSubmit(solutionData);
    }
  };

  // Opciones según el esquema de BD
  const dificultadOptions = [
    { value: "", label: "Seleccionar dificultad" },
    { value: "baja", label: "Baja" },
    { value: "media", label: "Media" },
    { value: "alta", label: "Alta" }
  ];

  const categoriaOptions = [
    { value: "", label: "Seleccionar categoría" },
    { value: "1", label: "Doméstico" },
    { value: "2", label: "Profesional" },
    { value: "3", label: "Industrial" }
  ];

  const efectividadOptions = [
    { value: "", label: "Seleccionar efectividad" },
    { value: "1", label: "Baja (1)" },
    { value: "2", label: "Media (2)" },
    { value: "3", label: "Alta (3)" },
    { value: "4", label: "Muy alta (4)" },
    { value: "5", label: "Máxima (5)" }
  ];

  // Listas de opciones para multi-select
  const ingredientesOptions = [
    "Bicarbonato de sodio", "Vinagre blanco", "Limón", "Sal", "Agua oxigenada",
    "Jabón neutro", "Alcohol isopropílico", "Detergente", "Amoníaco", "Agua caliente"
  ];

  const utensiliosOptions = [
    "Esponja suave", "Esponja abrasiva", "Paño de microfibra", "Cepillo de dientes",
    "Cepillo de cerdas duras", "Brocha", "Pulverizador", "Recipiente", "Guantes"
  ];

  const materialesOptions = [
    "Algodón", "Papel absorbente", "Trapo viejo", "Toalla", "Bolsa de plástico",
    "Cinta adhesiva", "Papel aluminio", "Film transparente"
  ];

  const precaucionesOptions = [
    "Usar guantes", "Ventilar la zona", "No mezclar productos químicos",
    "Mantener alejado de niños", "Probar en zona pequeña primero",
    "Usar mascarilla", "Evitar contacto con ojos", "Lavar manos después"
  ];

  return (
    <form className="solution-form" onSubmit={handleSubmit} noValidate>
      <FormField
        label="Título"
        id="solution-titulo"
        name="titulo"
        value={formData.titulo}
        onChange={handleChange}
        error={errors.titulo}
        required
      />

      <FormField
        label="Descripción"
        id="solution-descripcion"
        name="descripcion"
        type="textarea"
        rows={4}
        value={formData.descripcion}
        onChange={handleChange}
        error={errors.descripcion}
        required
      />

      <div className="form-row">
        <FormField
          label="Dificultad"
          id="solution-dificultad"
          name="dificultad"
          type="select"
          value={formData.dificultad}
          onChange={handleChange}
          error={errors.dificultad}
          options={dificultadOptions}
          required
        />

        <FormField
          label="Tiempo (minutos)"
          id="solution-tiempo"
          name="tiempo_minutos"
          type="number"
          min="1"
          max="240"
          value={formData.tiempo_minutos}
          onChange={handleChange}
          error={errors.tiempo_minutos}
          required
        />
      </div>

      <div className="form-row">
        <FormField
          label="Categoría"
          id="solution-categoria"
          name="categoria_id"
          type="select"
          value={formData.categoria_id}
          onChange={handleChange}
          error={errors.categoria_id}
          options={categoriaOptions}
          required
        />

        <FormField
          label="Efectividad"
          id="solution-efectividad"
          name="efectividad"
          type="select"
          value={formData.efectividad}
          onChange={handleChange}
          error={errors.efectividad}
          options={efectividadOptions}
          required
        />
      </div>

      <FormField
        label="Consejos (opcional)"
        id="solution-consejos"
        name="consejos"
        type="textarea"
        rows={3}
        value={formData.consejos}
        onChange={handleChange}
        placeholder="Consejos adicionales para mejorar el resultado..."
      />

      {/* Secciones de multi-select */}
      <div className="multi-select-section">
        <h4>Ingredientes necesarios</h4>
        <div className="checkbox-grid">
          {ingredientesOptions.map(ingrediente => (
            <label key={ingrediente} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.ingredientes.includes(ingrediente)}
                onChange={(e) => {
                  const newIngredientes = e.target.checked
                    ? [...formData.ingredientes, ingrediente]
                    : formData.ingredientes.filter(i => i !== ingrediente);
                  handleMultiSelectChange('ingredientes', newIngredientes);
                }}
              />
              <span>{ingrediente}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="multi-select-section">
        <h4>Utensilios necesarios</h4>
        <div className="checkbox-grid">
          {utensiliosOptions.map(utensilio => (
            <label key={utensilio} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.utensilios.includes(utensilio)}
                onChange={(e) => {
                  const newUtensilios = e.target.checked
                    ? [...formData.utensilios, utensilio]
                    : formData.utensilios.filter(u => u !== utensilio);
                  handleMultiSelectChange('utensilios', newUtensilios);
                }}
              />
              <span>{utensilio}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="multi-select-section">
        <h4>Materiales adicionales</h4>
        <div className="checkbox-grid">
          {materialesOptions.map(material => (
            <label key={material} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.materiales.includes(material)}
                onChange={(e) => {
                  const newMateriales = e.target.checked
                    ? [...formData.materiales, material]
                    : formData.materiales.filter(m => m !== material);
                  handleMultiSelectChange('materiales', newMateriales);
                }}
              />
              <span>{material}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="multi-select-section">
        <h4>Precauciones importantes</h4>
        <div className="checkbox-grid">
          {precaucionesOptions.map(precaucion => (
            <label key={precaucion} className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.precauciones.includes(precaucion)}
                onChange={(e) => {
                  const newPrecauciones = e.target.checked
                    ? [...formData.precauciones, precaucion]
                    : formData.precauciones.filter(p => p !== precaucion);
                  handleMultiSelectChange('precauciones', newPrecauciones);
                }}
              />
              <span>{precaucion}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="modal-actions">
        <Button type="submit">Guardar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default SolutionForm;
