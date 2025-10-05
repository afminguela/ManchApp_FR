import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qnpubedkzzpdajasjsuc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFucHViZWRrenpwZGFqYXNqc3VjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMTY0MjMsImV4cCI6MjA3Mzc5MjQyM30.4y4hbLORWx2VpYSSTCNrj00cgPKiR6sMhsACMtcki1A";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    console.log("🔍 Verificando esquema y datos en soluciones_limpieza...");

    // Primero ver todos los IDs existentes
    const { data: existingData, error: existingError } = await supabase
      .from("soluciones_limpieza")
      .select("id, titulo")
      .order("id", { ascending: true });

    if (existingError) {
      console.error("❌ Error obteniendo datos:", existingError);
      return;
    }

    console.log("📊 IDs existentes en la tabla:");
    existingData.forEach((item) => {
      console.log(`  ID: ${item.id} - Título: ${item.titulo}`);
    });

    console.log(`\n📈 Total de registros: ${existingData.length}`);
    if (existingData.length > 0) {
      console.log(`🔢 Último ID: ${existingData[existingData.length - 1].id}`);
    }

    // Intentar un insert mínimo para ver qué pasa
    console.log("\n🧪 Probando insert básico...");
    const { data: testInsert, error: insertError } = await supabase
      .from("soluciones_limpieza")
      .insert([
        {
          titulo: "Test " + new Date().toISOString(),
          categoria: 1,
          efectividad: 1,
          tiempo_minutos: 5,
          dificultad: "LOW",
          consejos: "Test",
          instrucciones: "Test",
        },
      ])
      .select();

    if (insertError) {
      console.error("❌ Error en insert de prueba:", insertError);
    } else {
      console.log("✅ Insert de prueba exitoso:", testInsert);

      // Eliminar el registro de prueba
      await supabase
        .from("soluciones_limpieza")
        .delete()
        .eq("id", testInsert[0].id);
      console.log("🗑️ Registro de prueba eliminado");
    }
  } catch (error) {
    console.error("💥 Error general:", error);
  }

  process.exit(0);
}

checkSchema();
