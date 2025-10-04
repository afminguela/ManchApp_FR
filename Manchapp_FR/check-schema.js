import { supabase } from "./src/supabaseClient.js";

async function checkSchema() {
  try {
    console.log("🔍 Verificando esquema real de soluciones_limpieza...");

    const { data, error } = await supabase
      .from("soluciones_limpieza")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Error:", error);
      return;
    }

    if (data && data.length > 0) {
      console.log("✅ Campos reales en soluciones_limpieza:");
      console.log(Object.keys(data[0]));
      console.log("\n📄 Ejemplo de datos:");
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log("⚠️ No hay datos en la tabla");
    }

    // También revisar otras tablas
    console.log("\n🔍 Verificando tabla ingredientes...");
    const { data: ingredientes } = await supabase
      .from("ingredientes")
      .select("*")
      .limit(3);

    if (ingredientes && ingredientes.length > 0) {
      console.log("Campos en ingredientes:", Object.keys(ingredientes[0]));
      console.log(
        "Ejemplos:",
        ingredientes.map((i) => i.nombre || i.name)
      );
    }

    console.log("\n🔍 Verificando tabla utensilios...");
    const { data: utensilios } = await supabase
      .from("utensilios")
      .select("*")
      .limit(3);

    if (utensilios && utensilios.length > 0) {
      console.log("Campos en utensilios:", Object.keys(utensilios[0]));
      console.log(
        "Ejemplos:",
        utensilios.map((u) => u.nombre || u.name)
      );
    }
  } catch (error) {
    console.error("💥 Error general:", error);
  }

  process.exit(0);
}

checkSchema();
