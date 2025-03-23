const mods: string[] = [
  "https://mods.vintagestory.at/show/mod/244", // xlib
  "https://mods.vintagestory.at/domesticanimaltrader", // Domestic Animal Trader
  "https://mods.vintagestory.at/wildfarmingrevival", // Wild Farming - Revival
  "https://mods.vintagestory.at/show/mod/463", // Instruments
  "https://mods.vintagestory.at/show/mod/17850", // Instruments Quackpack
  "https://mods.vintagestory.at/imgui", // vsimgui
  "https://mods.vintagestory.at/undergroundmines", // Underground mines
  "https://mods.vintagestory.at/thedungeon",
  "https://mods.vintagestory.at/betterruins",
  "https://mods.vintagestory.at/bettertraders",
  "https://mods.vintagestory.at/configlib",
  "https://mods.vintagestory.at/thedte", // Top entrance th3dungeon
  "https://mods.vintagestory.at/tailorsdelight",
  "https://mods.vintagestory.at/strspawnchances",
  "https://mods.vintagestory.at/stonequarry",
  "https://mods.vintagestory.at/simpletailoring",
  "https://mods.vintagestory.at/stonebakeoven",
  "https://mods.vintagestory.at/sortablestorage",
  "https://mods.vintagestory.at/smithingplus",
  "https://mods.vintagestory.at/sausages",
  "https://mods.vintagestory.at/rivers",
  "https://mods.vintagestory.at/vintageengineering",
  "https://mods.vintagestory.at/primitivesurvival",
  "https://mods.vintagestory.at/playercorpse",
  "https://mods.vintagestory.at/pei",
  "https://mods.vintagestory.at/morepiles",
  "https://mods.vintagestory.at/petai",
  "https://mods.vintagestory.at/millwright",
  "https://mods.vintagestory.at/liquidcontainers",
  "https://mods.vintagestory.at/knapster",
  "https://mods.vintagestory.at/fromgoldencombs",
  "https://mods.vintagestory.at/dinornithidae",
  "https://mods.vintagestory.at/rhinocerotidae",
  "https://mods.vintagestory.at/meiolaniidae",
  "https://mods.vintagestory.at/bovinae",
  "https://mods.vintagestory.at/elephantidae",
  "https://mods.vintagestory.at/felinae",
  "https://mods.vintagestory.at/spheniscidae",
  "https://mods.vintagestory.at/vombatidae",
  "https://mods.vintagestory.at/manidae",
  "https://mods.vintagestory.at/casuariidae",
  "https://mods.vintagestory.at/cervinae",
  "https://mods.vintagestory.at/sirenia",
  "https://mods.vintagestory.at/machairodontinae",
  "https://mods.vintagestory.at/caninae",
  "https://mods.vintagestory.at/capreolinae",
  "https://mods.vintagestory.at/pantherinae",
  "https://mods.vintagestory.at/viverridae",
  "https://mods.vintagestory.at/foodshelves",
  "https://mods.vintagestory.at/floralzonesmediterraneanregion",
  "https://mods.vintagestory.at/floralzoneseastasiaticregion",
  "https://mods.vintagestory.at/floralzonescentralaustralianregion",
  "https://mods.vintagestory.at/floralzonescaribbeanregion",
  "https://mods.vintagestory.at/floralzonescaperegion",
  "https://mods.vintagestory.at/floralzonesneozeylandicregion",
  "https://mods.vintagestory.at/extrainfo",
  "https://mods.vintagestory.at/expandedfoods",
  "https://mods.vintagestory.at/em",
  "https://mods.vintagestory.at/decorbazaar",
  "https://mods.vintagestory.at/tradercamps",
  "https://mods.vintagestory.at/commonlib",
  "https://mods.vintagestory.at/cats",
  "https://mods.vintagestory.at/canjewelry",
  "https://mods.vintagestory.at/butchering",
  "https://mods.vintagestory.at/betterfirepit",
  "https://mods.vintagestory.at/ancientarmory",
  "https://mods.vintagestory.at/animalcages",
  "https://mods.vintagestory.at/ancienttools",
  "https://mods.vintagestory.at/alchemy", // https://mods.vintagestory.at/download/35514/alchemy_1.6.48.zip
  "https://mods.vintagestory.at/aculinaryartillery", // https://mods.vintagestory.at/download/35171/ACulinaryArtillery%201.2.5.zip
  "https://mods.vintagestory.at/saltfromseawater",
  "https://mods.vintagestory.at/artofcooking",
  "https://mods.vintagestory.at/dressmakers",
].sort();

import { DOMParser } from "jsr:@b-fuze/deno-dom";

const modsDir = `C:/Users/LoneA/AppData/Roaming/VintagestoryData/Mods`;

// Empty the mods directory before downloading new mods
try {
  console.log(`Emptying mods directory: ${modsDir}`);

  // Read all files in the mods directory
  for (const dirEntry of Deno.readDirSync(modsDir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith('.zip')) {
      const filePath = `${modsDir}/${dirEntry.name}`;
      console.log(`Removing: ${filePath}`);
      Deno.removeSync(filePath);
    }
  }

  console.log('Mods directory emptied successfully');
} catch (error) {
  console.error('Error emptying mods directory:', error);
}

mods.forEach(async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();

    // Create a new DOM parser and parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Find the download button
    const downloadLink = doc.querySelector("a.downloadbutton");

    if (downloadLink) {
      const downloadUrl = `https://mods.vintagestory.at${downloadLink.getAttribute(
        "href"
      )}`.replace("%", "");
      const fileName = downloadLink.textContent?.trim() ?? "unknown.zip";

      console.log(`Found download: ${fileName} at ${downloadUrl}`);

      const modResponse = await fetch(downloadUrl);
      const file = await Deno.open(`${modsDir}/${fileName}`, { create: true, write: true });

      await modResponse.body?.pipeTo(file.writable);
    } else {
      console.log(`No download link found for: ${url}`);
    }
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
  }
});
