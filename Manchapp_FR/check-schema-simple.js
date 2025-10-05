import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qnpubedkzzpdajasjsuc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucHViZWRrenpwZGFqYXNqc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTY0MjMsImV4cCI6MjA3Mzc5MjQyM30.4y4hbLORWx2VpYSSTCNrj00cgPKiR6sMhsACMtcki1A";

const supabase = createClient(supabaseUrl, supabaseKey);

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

      // Si no hay datos, intentar hacer un insert básico para ver los campos requeridos
      console.log(
        "🔍 Intentando hacer insert básico para ver columnas requeridas..."
      );
      const { error: insertError } = await supabase
        .from("soluciones_limpieza")
        .insert([{ titulo: "test" }])
        .select();

      if (insertError) {
        console.log(
          "Error de insert (nos ayuda a ver la estructura):",
          insertError.message
        );
      }
    }
  } catch (error) {
    console.error("💥 Error general:", error);
  }

  process.exit(0);
}

checkSchema();
