import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase usando variables de entorno
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://qnpubedkzzpdajasjsuc.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucHViZWRrenpwZGFqYXNqc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTY0MjMsImV4cCI6MjA3Mzc5MjQyM30.4y4hbLORWx2VpYSSTCNrj00cgPKiR6sMhsACMtcki1A";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Funciones helper para la base de datos
export const supabaseService = {
  // Autenticación
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Soluciones
  async getSolutions() {
    try {
      console.log("🔍 Obteniendo soluciones desde Supabase...");

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("❌ Error obteniendo soluciones:", error);
        throw error;
      }

      console.log("✅ Soluciones obtenidas:", data?.length || 0);
      console.log("📋 Datos:", data);

      return { data, error };
    } catch (error) {
      console.error("💥 Error en getSolutions:", error);
      return { data: null, error };
    }
  },

  async createSolution(solution) {
    try {
      console.log("➕ Creando nueva solución:", solution);

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .insert([solution])
        .select();

      if (error) {
        console.error("❌ Error creando solución:", error);
        throw error;
      }

      console.log("✅ Solución creada:", data);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en createSolution:", error);
      return { data: null, error };
    }
  },

  async updateSolution(id, solution) {
    try {
      console.log("✏️ Actualizando solución:", id, solution);

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .update(solution)
        .eq("id", id)
        .select();

      if (error) {
        console.error("❌ Error actualizando solución:", error);
        throw error;
      }

      console.log("✅ Solución actualizada:", data);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en updateSolution:", error);
      return { data: null, error };
    }
  },

  async deleteSolution(id) {
    try {
      console.log("🗑️ Eliminando solución:", id);

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Error eliminando solución:", error);
        throw error;
      }

      console.log("✅ Solución eliminada");
      return { data, error };
    } catch (error) {
      console.error("💥 Error en deleteSolution:", error);
      return { data: null, error };
    }
  },

  // Función para verificar la conexión y debug
  async checkConnection() {
    try {
      console.log("🔌 Verificando conexión con Supabase...");
      console.log("🌍 URL:", supabaseUrl);
      console.log("🔑 Key exists:", !!supabaseKey);

      // Primero intentar una consulta simple
      const { data, error, count } = await supabase
        .from("soluciones_limpieza")
        .select("*", { count: "exact" });

      if (error) {
        console.error("❌ Error en consulta:", error);
        return { connected: false, error: error.message };
      }

      console.log(`✅ Conexión exitosa. ${count} soluciones encontradas.`);
      console.log("📊 Primeras 3 soluciones:", data?.slice(0, 3));

      return {
        connected: true,
        count,
        sampleData: data?.slice(0, 3) || [],
      };
    } catch (error) {
      console.error("💥 Error verificando conexión:", error);
      return { connected: false, error: error.message };
    }
  },

  // Funciones mejoradas para manejar relaciones many-to-many
  async createSolutionWithRelations(solutionData) {
    try {
      console.log("➕ Creando solución con relaciones:", solutionData);

      // Extraer arrays de relaciones
      const { ingredientes, utensilios, materiales, precauciones, ...solutionFields } = solutionData;

      // 1. Crear la solución principal
      const { data: solution, error: solutionError } = await supabase
        .from("soluciones_limpieza")
        .insert([solutionFields])
        .select()
        .single();

      if (solutionError) throw solutionError;

      const solutionId = solution.id;

      // 2. Manejar ingredientes
      if (ingredientes && ingredientes.length > 0) {
        await this.manageSolutionIngredientes(solutionId, ingredientes);
      }

      // 3. Manejar utensilios
      if (utensilios && utensilios.length > 0) {
        await this.manageSolutionUtensilios(solutionId, utensilios);
      }

      // 4. Manejar materiales
      if (materiales && materiales.length > 0) {
        await this.manageSolutionMateriales(solutionId, materiales);
      }

      // 5. Manejar precauciones
      if (precauciones && precauciones.length > 0) {
        await this.manageSolutionPrecauciones(solutionId, precauciones);
      }

      console.log("✅ Solución creada con relaciones:", solutionId);
      return { data: solution, error: null };
    } catch (error) {
      console.error("💥 Error en createSolutionWithRelations:", error);
      return { data: null, error };
    }
  },

  async updateSolutionWithRelations(solutionId, solutionData) {
    try {
      console.log("✏️ Actualizando solución con relaciones:", solutionId, solutionData);

      // Extraer arrays de relaciones
      const { ingredientes, utensilios, materiales, precauciones, ...solutionFields } = solutionData;

      // 1. Actualizar la solución principal
      const { data: solution, error: solutionError } = await supabase
        .from("soluciones_limpieza")
        .update(solutionFields)
        .eq("id", solutionId)
        .select()
        .single();

      if (solutionError) throw solutionError;

      // 2. Actualizar relaciones
      if (ingredientes !== undefined) {
        await this.manageSolutionIngredientes(solutionId, ingredientes);
      }

      if (utensilios !== undefined) {
        await this.manageSolutionUtensilios(solutionId, utensilios);
      }

      if (materiales !== undefined) {
        await this.manageSolutionMateriales(solutionId, materiales);
      }

      if (precauciones !== undefined) {
        await this.manageSolutionPrecauciones(solutionId, precauciones);
      }

      console.log("✅ Solución actualizada con relaciones:", solutionId);
      return { data: solution, error: null };
    } catch (error) {
      console.error("💥 Error en updateSolutionWithRelations:", error);
      return { data: null, error };
    }
  },

  // Funciones helper para manejar cada tipo de relación
  async manageSolutionIngredientes(solutionId, ingredientes) {
    // Eliminar relaciones existentes
    await supabase
      .from("soluciones_limpieza_ingredientes")
      .delete()
      .eq("solucion_id", solutionId);

    // Crear nuevas relaciones
    if (ingredientes.length > 0) {
      const ingredientesRelations = await Promise.all(
        ingredientes.map(async (nombreIngrediente) => {
          // Buscar o crear ingrediente
          let { data: ingrediente } = await supabase
            .from("ingredientes")
            .select("id")
            .eq("nombre", nombreIngrediente)
            .single();

          if (!ingrediente) {
            const { data: newIngrediente } = await supabase
              .from("ingredientes")
              .insert([{ nombre: nombreIngrediente }])
              .select("id")
              .single();
            ingrediente = newIngrediente;
          }

          return {
            solucion_id: solutionId,
            ingrediente_id: ingrediente.id
          };
        })
      );

      await supabase
        .from("soluciones_limpieza_ingredientes")
        .insert(ingredientesRelations);
    }
  },

  async manageSolutionUtensilios(solutionId, utensilios) {
    // Eliminar relaciones existentes
    await supabase
      .from("soluciones_limpieza_utensilios")
      .delete()
      .eq("solucion_id", solutionId);

    // Crear nuevas relaciones
    if (utensilios.length > 0) {
      const utensiliosRelations = await Promise.all(
        utensilios.map(async (nombreUtensilio) => {
          // Buscar o crear utensilio
          let { data: utensilio } = await supabase
            .from("utensilios")
            .select("id")
            .eq("nombre", nombreUtensilio)
            .single();

          if (!utensilio) {
            const { data: newUtensilio } = await supabase
              .from("utensilios")
              .insert([{ nombre: nombreUtensilio }])
              .select("id")
              .single();
            utensilio = newUtensilio;
          }

          return {
            solucion_id: solutionId,
            utensilio_id: utensilio.id
          };
        })
      );

      await supabase
        .from("soluciones_limpieza_utensilios")
        .insert(utensiliosRelations);
    }
  },

  async manageSolutionMateriales(solutionId, materiales) {
    // Eliminar relaciones existentes
    await supabase
      .from("solucion_material")
      .delete()
      .eq("solucion_id", solutionId);

    // Crear nuevas relaciones
    if (materiales.length > 0) {
      const materialesRelations = await Promise.all(
        materiales.map(async (nombreMaterial) => {
          // Buscar o crear material
          let { data: material } = await supabase
            .from("materiales")
            .select("id")
            .eq("nombre", nombreMaterial)
            .single();

          if (!material) {
            const { data: newMaterial } = await supabase
              .from("materiales")
              .insert([{ nombre: nombreMaterial }])
              .select("id")
              .single();
            material = newMaterial;
          }

          return {
            solucion_id: solutionId,
            material_id: material.id
          };
        })
      );

      await supabase
        .from("solucion_material")
        .insert(materialesRelations);
    }
  },

  async manageSolutionPrecauciones(solutionId, precauciones) {
    // Eliminar relaciones existentes
    await supabase
      .from("solucion_precauciones")
      .delete()
      .eq("solucion_id", solutionId);

    // Crear nuevas relaciones
    if (precauciones.length > 0) {
      const precaucionesRelations = await Promise.all(
        precauciones.map(async (descripcionPrecaucion) => {
          // Buscar o crear precaución
          let { data: precaucion } = await supabase
            .from("precauciones")
            .select("id")
            .eq("descripcion", descripcionPrecaucion)
            .single();

          if (!precaucion) {
            const { data: newPrecaucion } = await supabase
              .from("precauciones")
              .insert([{ descripcion: descripcionPrecaucion }])
              .select("id")
              .single();
            precaucion = newPrecaucion;
          }

          return {
            solucion_id: solutionId,
            precaucion_id: precaucion.id
          };
        })
      );

      await supabase
        .from("solucion_precauciones")
        .insert(precaucionesRelations);
    }
  },

  // Función para obtener solución completa con todas las relaciones
  async getSolutionComplete(solutionId) {
    try {
      console.log("🔍 Obteniendo solución completa:", solutionId);

      const { data: solution, error } = await supabase
        .from("soluciones_limpieza")
        .select(`
          *,
          soluciones_limpieza_ingredientes(
            ingredientes(id, nombre)
          ),
          soluciones_limpieza_utensilios(
            utensilios(id, nombre)
          ),
          solucion_material(
            materiales(id, nombre)
          ),
          solucion_precauciones(
            precauciones(id, descripcion)
          )
        `)
        .eq("id", solutionId)
        .single();

      if (error) throw error;

      // Formatear los datos para el formulario
      const formattedSolution = {
        ...solution,
        ingredientes: solution.soluciones_limpieza_ingredientes?.map(rel => rel.ingredientes.nombre) || [],
        utensilios: solution.soluciones_limpieza_utensilios?.map(rel => rel.utensilios.nombre) || [],
        materiales: solution.solucion_material?.map(rel => rel.materiales.nombre) || [],
        precauciones: solution.solucion_precauciones?.map(rel => rel.precauciones.descripcion) || []
      };

      console.log("✅ Solución completa obtenida:", formattedSolution);
      return { data: formattedSolution, error: null };
    } catch (error) {
      console.error("💥 Error en getSolutionComplete:", error);
      return { data: null, error };
    }
  },
};pYXQiOjE3NTgyMTY0MjMsImV4cCI6MjA3Mzc5MjQyM30.4y4hbLORWx2VpYSSTCNrj00cgPKiR6sMhsACMtcki1A";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Funciones helper para la base de datos
export const supabaseService = {
  // Autenticación
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Soluciones
  async getSolutions() {
    try {
      console.log("🔍 Obteniendo soluciones desde Supabase...");

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("❌ Error obteniendo soluciones:", error);
        throw error;
      }

      console.log("✅ Soluciones obtenidas:", data?.length || 0);
      console.log("📋 Datos:", data);

      return { data, error };
    } catch (error) {
      console.error("💥 Error en getSolutions:", error);
      return { data: null, error };
    }
  },

  async createSolution(solution) {
    try {
      console.log("➕ Creando nueva solución:", solution);

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .insert([solution])
        .select();

      if (error) {
        console.error("❌ Error creando solución:", error);
        throw error;
      }

      console.log("✅ Solución creada:", data);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en createSolution:", error);
      return { data: null, error };
    }
  },

  async updateSolution(id, solution) {
    try {
      console.log("✏️ Actualizando solución:", id, solution);

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .update(solution)
        .eq("id", id)
        .select();

      if (error) {
        console.error("❌ Error actualizando solución:", error);
        throw error;
      }

      console.log("✅ Solución actualizada:", data);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en updateSolution:", error);
      return { data: null, error };
    }
  },

  async deleteSolution(id) {
    try {
      console.log("🗑️ Eliminando solución:", id);

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ Error eliminando solución:", error);
        throw error;
      }

      console.log("✅ Solución eliminada");
      return { data, error };
    } catch (error) {
      console.error("💥 Error en deleteSolution:", error);
      return { data: null, error };
    }
  },

  // Función para verificar la conexión y debug
  async checkConnection() {
    try {
      console.log("🔌 Verificando conexión con Supabase...");
      console.log("🌍 URL:", supabaseUrl);
      console.log("🔑 Key exists:", !!supabaseKey);

      // Primero intentar una consulta simple
      const { data, error, count } = await supabase
        .from("soluciones_limpieza")
        .select("*", { count: "exact" });

      if (error) {
        console.error("❌ Error en consulta:", error);

        // Si la tabla no existe, intentar verificar las tablas disponibles
        if (
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.log(
            '⚠️ La tabla "soluciones_limpieza" no existe. Verificando tablas disponibles...'
          );

          // Intentar obtener información sobre las tablas
          const { data: tables, error: tablesError } = await supabase
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public");

          if (!tablesError) {
            console.log(
              "📋 Tablas disponibles:",
              tables?.map((t) => t.table_name)
            );
          }
        }

        throw error;
      }

      console.log("✅ Conexión exitosa");
      console.log("📊 Soluciones encontradas:", data?.length || 0);
      console.log("📊 Count:", count);
      console.log("🗂️ Datos:", data);

      return {
        connected: true,
        count: count || 0,
        data: data || [],
      };
    } catch (error) {
      console.error("💥 Error de conexión:", error);
      return { connected: false, error: error.message };
    }
  },

  // Función para insertar datos de ejemplo
  async insertSampleData() {
    try {
      console.log("📝 Insertando datos de ejemplo...");

      const sampleSolutions = [
        {
          titulo: "Quitar vino tinto de algodón",
          instrucciones:
            "Espolvorear sal sobre la mancha fresca, dejar absorber unos minutos, retirar la sal, enjuagar con agua fría y lavar con detergente suave.",
          dificultad: "facil",
          tiempo_minutos: 15,
          consejos:
            "No dejar secar la mancha antes de limpiar. Si la mancha persiste, aplicar agua oxigenada diluida.",
          categoria: 1,
          efectividad: 4,
        },
        {
          titulo: "Eliminar grasa de cuero",
          instrucciones:
            "Usar cepillo y detergente suave, frotar suavemente y limpiar con paño húmedo.",
          dificultad: "medio",
          tiempo_minutos: 10,
          consejos: "No mojar demasiado el cuero.",
          categoria: 2,
          efectividad: 3,
        },
        {
          titulo: "Quitar café de lino",
          instrucciones:
            "Aplicar agua fría y jabón neutro, frotar suavemente y enjuagar.",
          dificultad: "facil",
          tiempo_minutos: 8,
          consejos: "Actuar rápido antes de que se seque.",
          categoria: 1,
          efectividad: 4,
        },
      ];

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .insert(sampleSolutions)
        .select();

      if (error) {
        console.error("❌ Error insertando datos de ejemplo:", error);
        throw error;
      }

      console.log("✅ Datos de ejemplo insertados:", data?.length);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en insertSampleData:", error);
      return { data: null, error };
    }
  },

  // Funciones para búsqueda avanzada
  async getMateriales() {
    try {
      console.log("🔍 Obteniendo materiales...");

      const { data, error } = await supabase
        .from("materiales")
        .select("id, nombre, descripcion")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo materiales:", error);

        // Si la tabla no existe, intentar verificar las tablas disponibles
        if (
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.log(
            '⚠️ La tabla "materiales" no existe. Verificando tablas disponibles...'
          );

          const { data: tables, error: tablesError } = await supabase
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public");

          if (!tablesError) {
            console.log(
              "📋 Tablas disponibles:",
              tables?.map((t) => t.table_name)
            );
          }
        }

        throw error;
      }

      console.log("✅ Materiales obtenidos:", data?.length || 0);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en getMateriales:", error);
      return { data: null, error };
    }
  },

  async getSustancias() {
    try {
      console.log("🔍 Obteniendo sustancias...");

      const { data, error } = await supabase
        .from("sustancias")
        .select("id, nombre, descripcion, tipo_sustancia")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo sustancias:", error);

        // Si la tabla no existe, intentar verificar las tablas disponibles
        if (
          error.message.includes("relation") ||
          error.message.includes("does not exist")
        ) {
          console.log(
            '⚠️ La tabla "sustancias" no existe. Verificando tablas disponibles...'
          );

          const { data: tables, error: tablesError } = await supabase
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public");

          if (!tablesError) {
            console.log(
              "📋 Tablas disponibles:",
              tables?.map((t) => t.table_name)
            );
          }
        }

        throw error;
      }

      console.log("✅ Sustancias obtenidas:", data?.length || 0);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en getSustancias:", error);
      return { data: null, error };
    }
  },

  async searchSolucionesByMaterialAndSustancia(materialId, sustanciaId) {
    try {
      console.log("🔍 Buscando soluciones para:", { materialId, sustanciaId });

      // Primero, encontrar las manchas que corresponden a la sustancia
      const { data: manchas, error: manchasError } = await supabase
        .from("manchas")
        .select("id")
        .eq("sustancia_id", sustanciaId);

      if (manchasError) {
        console.error("❌ Error obteniendo manchas:", manchasError);
        throw manchasError;
      }

      if (!manchas || manchas.length === 0) {
        console.log("⚠️ No se encontraron manchas para esta sustancia");
        return { data: [], error: null };
      }

      const manchaIds = manchas.map((m) => m.id);
      console.log("📋 Manchas encontradas:", manchaIds);

      // Buscar soluciones que coincidan con las manchas y el material
      const { data: solucionesCompletas, error: solucionesError } =
        await supabase
          .from("soluciones_limpieza")
          .select(
            `
          *,
          solucion_mancha!inner(mancha_id),
          solucion_material!inner(material_id),
          soluciones_limpieza_ingredientes(
            ingredientes(
              id,
              propiedades,
              tipo_ingrediente,
              sustancias(nombre, descripcion)
            )
          ),
          soluciones_limpieza_utensilios(
            utensilios(
              id,
              nombre,
              descripcion
            )
          ),
          solucion_precauciones(
            precauciones(
              id,
              descripcion
            )
          )
        `
          )
          .in("solucion_mancha.mancha_id", manchaIds)
          .eq("solucion_material.material_id", materialId);

      if (solucionesError) {
        console.error("❌ Error obteniendo soluciones:", solucionesError);
        throw solucionesError;
      }

      console.log(
        "✅ Soluciones encontradas:",
        solucionesCompletas?.length || 0
      );
      console.log("🗂️ Datos completos:", solucionesCompletas);

      return { data: solucionesCompletas || [], error: null };
    } catch (error) {
      console.error(
        "💥 Error en searchSolucionesByMaterialAndSustancia:",
        error
      );
      return { data: [], error };
    }
  },
};
