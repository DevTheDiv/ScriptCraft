package org.scriptcraftjs.bukkit;

import org.bukkit.command.Command;
import org.bukkit.command.CommandSender;
import org.bukkit.plugin.java.JavaPlugin;

import org.apache.commons.io.FileUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Enumeration;
import java.util.jar.JarFile;
import java.util.jar.JarEntry;

import java.net.URL;
import java.net.JarURLConnection;

import java.io.*;

import javax.script.Invocable;

import org.graalvm.polyglot.*;
import com.oracle.truffle.js.scriptengine.GraalJSScriptEngine;



public class ScriptCraftPlugin extends JavaPlugin
{
    public boolean canary = false;
    public boolean bukkit = true;
    // right now all ops share the same JS context/scope
    // need to look at possibly having context/scope per operator
    //protected Map<CommandSender,ScriptCraftEvaluator> playerContexts = new HashMap<CommandSender,ScriptCraftEvaluator>();
    private String NO_JAVASCRIPT_MESSAGE = "No JavaScript Engine available. ScriptCraft will not work without Javascript.";
    protected GraalJSScriptEngine engine = null;




    ScriptCraftPlugin self = this;


    @Override public void onEnable()
    {
        Thread currentThread = Thread.currentThread();
        currentThread.setContextClassLoader(getClass().getClassLoader());
        ClassLoader classLoader = currentThread.getContextClassLoader();
        try {
            // The Node Environment controls the environment for many scripts

            // Check For Engines
            // List<ScriptEngineFactory> engines = (new ScriptEngineManager()).getEngineFactories();
            // for (ScriptEngineFactory f: engines) {
            //     System.out.println(f.getLanguageName()+" -> "+f.getEngineName()+" ->"+f.getNames().toString());
            // }

            File scdir = new File("scriptcraft");
            if(scdir.exists() == false ){
                FileUtils.forceMkdir(scdir);
            }

            // Loop through all resources
            Enumeration<URL> res  = classLoader.getResources("scriptcraft");
            while (res.hasMoreElements()) {
                URL url = res.nextElement();
                JarURLConnection urlcon = (JarURLConnection) (url.openConnection());
                JarFile jar = urlcon.getJarFile();
                Enumeration<JarEntry> entries = jar.entries();
                // Loop Through All Jar Entries
                while (entries.hasMoreElements()) {
                    JarEntry element = entries.nextElement();
                    String name = element.getName();
                    // If this is a scriptcraft resource we will export it out of the jar
                    if (name.startsWith("scriptcraft")){
                        // if it already exists continue
                        if(new File(name).exists()) continue;
                        System.out.println("Generating ScriptCraft File " + name);
                        // otherwise make new
                        if (element.isDirectory()) FileUtils.forceMkdir(new File(name));
                        else FileUtils.copyInputStreamToFile(classLoader.getResourceAsStream(name), new File(name));
                    }
                }
            }

            
            System.out.println(scdir.getAbsolutePath());

            Context.Builder builder = Context
                .newBuilder("js")
                .allowPolyglotAccess(PolyglotAccess.ALL)
                .allowAllAccess(true)
                .allowHostAccess(HostAccess.ALL)
                .allowHostClassLookup(s -> true)
                .allowHostClassLoading(true)
                .allowCreateThread(true)
                .allowIO(true)
                .allowExperimentalOptions(true)
                .option("js.nashorn-compat", "true")
                .option("js.ecmascript-version", "latest")
                .option("js.v8-compat", "true")
                .option("js.commonjs-require", "true")
                .option("js.commonjs-require-cwd", scdir.getAbsolutePath())
                .option("js.commonjs-require-path", "lib" + File.pathSeparator + "modules")
                .option("js.esm-eval-returns-exports", "true")
                .option("js.foreign-object-prototype", "true");

            this.engine = GraalJSScriptEngine.create(null, builder);
            this.engine.put("__plugin__", this);


            //Now start up scriptcraft
            File bootstrap = new File("scriptcraft/bootstrap.js");
            InputStreamReader jscript = new InputStreamReader( new FileInputStream(bootstrap));
            this.engine.eval(jscript);

            Invocable inv = (Invocable) this.engine;
            inv.invokeFunction("__onEnable");

        } catch (Exception e) {
            e.printStackTrace();
            this.getLogger().severe(e.getMessage());
        } finally {
            currentThread.setContextClassLoader(classLoader);
        }
    }


    public List<String> onTabComplete(CommandSender sender, Command cmd,
                                      String alias,
                                      String[] args)
    {
        // Tab completion is now handled directly by the dynamically registered BukkitCommands
        // and the native-command.js utility, so we no longer need to proxy it through the 
        // legacy __onTabComplete global JS function for the base /jsp command.
        return new ArrayList<String>();
    }

    public boolean onCommand(CommandSender sender, Command cmd, String label, String[] args)
    {
        Object jsResult = null;
        if (this.engine == null) {
            this.getLogger().severe(NO_JAVASCRIPT_MESSAGE);
            return false;
        }
        try {
            jsResult = ((Invocable)this.engine).invokeFunction("__onCommand", sender, cmd, label, args);
        } catch (Exception se) {
            this.getLogger().severe(se.toString());
            se.printStackTrace();
            sender.sendMessage(se.getMessage());
        }
        if (jsResult != null){
            return ((Boolean)jsResult).booleanValue();
        }
        return false;        
    }
}
