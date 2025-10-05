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

  async signUp(name, email, password) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: name,
            display_name: name,
          },
        },
      });

      if (authError) {
        return { data: null, error: authError };
      }

      if (authData.user) {
        try {
          await supabase
            .from("usuarios")
            .insert([
              {
                user: name,
                email: email,
                password: "***",
              },
            ])
            .select();
        } catch {
          console.error("❌ Error al crear perfil de usuario");
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  },

  async getSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  },

  // Usuarios - Tabla personalizada
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("❌ Error al obtener perfil de usuario:", error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error("❌ Excepción al obtener perfil:", error);
      return { data: null, error };
    }
  },

  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .update(updates)
        .eq("id", userId)
        .select();

      if (error) {
        console.error("❌ Error al actualizar perfil:", error);
        return { data: null, error };
      }

      console.log("✅ Perfil actualizado:", data);
      return { data, error: null };
    } catch (error) {
      console.error("❌ Excepción al actualizar perfil:", error);
      return { data: null, error };
    }
  },

  // -----------------------------------------FUNCIONES DE SOLUCIONES - CRUD
  async getSolutions() {
    try {
      console.log("🔍 Obteniendo soluciones desde Supabase...");

      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .select(
          `
          *,
          soluciones_limpieza_ingredientes (
            ingredientes (
              id,
              tipo_ingrediente,
              propiedades,
              sustancias (
                id,
                nombre,
                descripcion
              )
            )
          ),
          soluciones_limpieza_utensilios (
            utensilios (
              id,
              nombre,
              descripcion
            )
          ),
          solucion_precauciones (
            precauciones (
              id,
              descripcion
            )
          ),
          solucion_material (
            materiales (
              id,
              nombre,
              descripcion
            )
          )
        `
        )
        .order("id", { ascending: false });

      if (error) {
        console.error("❌ Error obteniendo soluciones:", error);
        throw error;
      }

      console.log("✅ Soluciones obtenidas:", data?.length || 0);
      console.log("🔗 Primera solución con relaciones:", data?.[0]);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en getSolutions:", error);
      return { data: null, error };
    }
  },
// Create 
  async createSolution(solution) {
    try {
      console.log("➕ Creando nueva solución:", solution);

      // Determinar si usar función básica o con relaciones
      if (
        solution.ingredientes ||
        solution.utensilios ||
        solution.materiales ||
        solution.precauciones
      ) {
        return await this.createSolutionWithRelations(solution);
      }

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

  //Update
  async updateSolution(id, solution) {
    try {
      console.log("✏️ Actualizando solución:", id, solution);

      // Determinar si usar función básica o con relaciones
      if (
        solution.ingredientes ||
        solution.utensilios ||
        solution.materiales ||
        solution.precauciones
      ) {
        return await this.updateSolutionWithRelations(id, solution);
      }

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
// Delete
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

  //--------------------------------- Función para verificar la conexión
  async checkConnection() {
    try {
      console.log("🔌 Verificando conexión con Supabase...");

      const { data, error, count } = await supabase
        .from("soluciones_limpieza")
        .select("*", { count: "exact" });

      if (error) {
        console.error("❌ Error en consulta:", error);
        return { connected: false, error: error.message };
      }

      console.log(`✅ Conexión exitosa. ${count} soluciones encontradas.`);
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

  // ---------------------------------Funciones para obtener datos de las Tablas
  async getMateriales() {
    try {
      console.log("🔍 Obteniendo materiales desde Supabase...");

      const { data, error } = await supabase
        .from("materiales")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo materiales:", error);
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
      console.log("🔍 Obteniendo sustancias desde Supabase...");

      const { data, error } = await supabase
        .from("sustancias")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo sustancias:", error);
        throw error;
      }

      console.log("✅ Sustancias obtenidas:", data?.length || 0);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en getSustancias:", error);
      return { data: null, error };
    }
  },

  async getManchas() {
    try {
      console.log("🔍 Obteniendo manchas desde Supabase...");

      const { data, error } = await supabase
        .from("manchas")
        .select("*")
        .order("nombre", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo manchas:", error);
        throw error;
      }

      console.log("✅ Manchas obtenidas:", data?.length || 0);
      return { data, error };
    } catch (error) {
      console.error("💥 Error en getManchas:", error);
      return { data: null, error };
    }
  },

  // Función de búsqueda (si es necesaria)
  async searchSolucionesByMaterialAndSustancia(materialId, sustanciaIds) {
    try {
      console.log("🔍 Buscando soluciones por material y sustancias:", {
        materialId,
        sustanciaIds,
      });

      // Realizar la consulta con los IDs de material y sustancia
      const { data, error } = await supabase
        .from("soluciones_limpieza")
        .select(
          `
          *,
          solucion_material!inner(material_id),
          soluciones_limpieza_ingredientes(
            ingredientes(sustancia_id)
          )
        `
        )
        .eq("solucion_material.material_id", materialId);

      if (error) {
        console.error("❌ Error en búsqueda:", error);
        throw error;
      }

      console.log("✅ Soluciones encontradas:", data?.length || 0);
      return { data: data || [], error };
    } catch (error) {
      console.error(
        "💥 Error en searchSolucionesByMaterialAndSustancia:",
        error
      );
      return { data: [], error };
    }
  },

  // Funciones con relaciones many-to-many
  async createSolutionWithRelations(solutionData) {
    try {
      console.log("➕ Creando solución con relaciones:", solutionData);

      const {
        ingredientes,
        utensilios,
        materiales,
        precauciones,
        id, 
        ...solutionFields
      } = solutionData;

      // 1. Crear la solución principal
      console.log("📤 Campos que se van a insertar:", solutionFields);
      console.log("🔍 ID extraído (no se insertará):", id);

      
      delete solutionFields.id;
      console.log("🧹 Después de eliminar id:", solutionFields);

      const { data: solution, error: solutionError } = await supabase
        .from("soluciones_limpieza")
        .insert([solutionFields])
        .select()
        .single();

      if (solutionError) throw solutionError;

      const solutionId = solution.id;
      console.log("✅ Solución principal creada con ID:", solutionId);

      // 2. Manejar relaciones (con manejo de errores para no fallar toda la operación)
      try {
        if (ingredientes && ingredientes.length > 0) {
          console.log("🔗 Procesando ingredientes...");
          await this.manageSolutionIngredientes(solutionId, ingredientes);
        }
      } catch (error) {
        console.warn(
          "⚠️ Error manejando ingredientes (continuando):",
          error.message
        );
      }

      try {
        if (utensilios && utensilios.length > 0) {
          console.log("🔗 Procesando utensilios...");
          await this.manageSolutionUtensilios(solutionId, utensilios);
        }
      } catch (error) {
        console.warn(
          "⚠️ Error manejando utensilios (continuando):",
          error.message
        );
      }

      try {
        if (materiales && materiales.length > 0) {
          console.log("🔗 Procesando materiales...");
          await this.manageSolutionMateriales(solutionId, materiales);
        }
      } catch (error) {
        console.warn(
          "⚠️ Error manejando materiales (continuando):",
          error.message
        );
      }

      try {
        if (precauciones && precauciones.length > 0) {
          console.log("🔗 Procesando precauciones...");
          await this.manageSolutionPrecauciones(solutionId, precauciones);
        }
      } catch (error) {
        console.warn(
          "⚠️ Error manejando precauciones (continuando):",
          error.message
        );
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
      console.log("✏️ Actualizando solución con relaciones:", solutionId);

      const {
        ingredientes,
        utensilios,
        materiales,
        precauciones,
        ...solutionFields
      } = solutionData;

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

  // Funciones helper para manejar relaciones
  async manageSolutionIngredientes(solutionId, ingredientes) {
    try {
      await supabase
        .from("soluciones_limpieza_ingredientes")
        .delete()
        .eq("solucion_id", solutionId);

      if (ingredientes.length > 0) {
        const ingredientesRelations = await Promise.all(
          ingredientes.map(async (nombreIngrediente) => {
            try {
              let { data: ingrediente } = await supabase
                .from("ingredientes")
                .select("id")
                .eq("nombre", nombreIngrediente)
                .single();

              if (!ingrediente) {
                const { data: newIngrediente, error: insertError } =
                  await supabase
                    .from("ingredientes")
                    .insert([{ nombre: nombreIngrediente }])
                    .select("id")
                    .single();

                if (insertError) {
                  console.warn(
                    `⚠️ No se pudo crear ingrediente "${nombreIngrediente}":`,
                    insertError.message
                  );
                  return null;
                }
                ingrediente = newIngrediente;
              }

              if (!ingrediente || !ingrediente.id) {
                console.warn(
                  `⚠️ Ingrediente "${nombreIngrediente}" no tiene ID válido`
                );
                return null;
              }

              return {
                solucion_id: solutionId,
                ingrediente_id: ingrediente.id,
              };
            } catch (error) {
              console.warn(
                `⚠️ Error procesando ingrediente "${nombreIngrediente}":`,
                error.message
              );
              return null;
            }
          })
        );

        // Filtrar nulls y solo insertar relaciones válidas
        const validRelations = ingredientesRelations.filter((r) => r !== null);

        if (validRelations.length > 0) {
          await supabase
            .from("soluciones_limpieza_ingredientes")
            .insert(validRelations);
        }
      }
    } catch (error) {
      console.error("⚠️ Error en manageSolutionIngredientes:", error.message);
      // No lanzar el error para que la solución principal se guarde
    }
  },

  async manageSolutionUtensilios(solutionId, utensilios) {
    try {
      await supabase
        .from("soluciones_limpieza_utensilios")
        .delete()
        .eq("solucion_id", solutionId);

      if (utensilios.length > 0) {
        const utensiliosRelations = await Promise.all(
          utensilios.map(async (nombreUtensilio) => {
            try {
              let { data: utensilio } = await supabase
                .from("utensilios")
                .select("id")
                .eq("nombre", nombreUtensilio)
                .single();

              if (!utensilio) {
                const { data: newUtensilio, error: insertError } =
                  await supabase
                    .from("utensilios")
                    .insert([{ nombre: nombreUtensilio }])
                    .select("id")
                    .single();

                if (insertError) {
                  console.warn(
                    `⚠️ No se pudo crear utensilio "${nombreUtensilio}":`,
                    insertError.message
                  );
                  return null;
                }
                utensilio = newUtensilio;
              }

              if (!utensilio || !utensilio.id) {
                console.warn(
                  `⚠️ Utensilio "${nombreUtensilio}" no tiene ID válido`
                );
                return null;
              }

              return {
                solucion_id: solutionId,
                utensilio_id: utensilio.id,
              };
            } catch (error) {
              console.warn(
                `⚠️ Error procesando utensilio "${nombreUtensilio}":`,
                error.message
              );
              return null;
            }
          })
        );

        const validRelations = utensiliosRelations.filter((r) => r !== null);

        if (validRelations.length > 0) {
          await supabase
            .from("soluciones_limpieza_utensilios")
            .insert(validRelations);
        }
      }
    } catch (error) {
      console.error("⚠️ Error en manageSolutionUtensilios:", error.message);
    }
  },

  async manageSolutionMateriales(solutionId, materiales) {
    await supabase
      .from("solucion_material")
      .delete()
      .eq("solucion_id", solutionId);

    if (materiales.length > 0) {
      const materialesRelations = await Promise.all(
        materiales.map(async (nombreMaterial) => {
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
            material_id: material.id,
          };
        })
      );

      await supabase.from("solucion_material").insert(materialesRelations);
    }
  },

  async manageSolutionPrecauciones(solutionId, precauciones) {
    await supabase
      .from("solucion_precauciones")
      .delete()
      .eq("solucion_id", solutionId);

    if (precauciones.length > 0) {
      const precaucionesRelations = await Promise.all(
        precauciones.map(async (descripcionPrecaucion) => {
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
            precaucion_id: precaucion.id,
          };
        })
      );

      await supabase
        .from("solucion_precauciones")
        .insert(precaucionesRelations);
    }
  },

  // Funciones para obtener catálogos de ingredientes y utensilios
  async getIngredientes() {
    try {
      console.log("🔍 Obteniendo ingredientes desde Supabase...");

      const { data, error } = await supabase
        .from("ingredientes")
        .select(
          `
          id,
          disponible_supermercado,
          propiedades,
          tipo_ingrediente,
          sustancia_id,
          sustancias (
            id,
            nombre,
            descripcion
          )
        `
        )
        .order("id", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo ingredientes:", error);
        throw error;
      }

      // Transformar datos para incluir nombre de la sustancia
      const ingredientesConNombres =
        data?.map((ingrediente) => ({
          ...ingrediente,
          nombre:
            ingrediente.sustancias?.nombre || `Ingrediente ${ingrediente.id}`,
        })) || [];

      console.log("✅ Ingredientes obtenidos:", ingredientesConNombres.length);
      return ingredientesConNombres;
    } catch (error) {
      console.error("💥 Error en getIngredientes:", error);
      return [];
    }
  },

  async getUtensilios() {
    try {
      console.log("🔍 Obteniendo utensilios desde Supabase...");

      const { data, error } = await supabase
        .from("utensilios")
        .select("*")
        .order("id", { ascending: true });

      if (error) {
        console.error("❌ Error obteniendo utensilios:", error);
        throw error;
      }

      console.log("✅ Utensilios obtenidos:", data?.length || 0);
      return data || [];
    } catch (error) {
      console.error("💥 Error en getUtensilios:", error);
      return [];
    }
  },
};
