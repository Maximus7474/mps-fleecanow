export async function VersionCheck() {
  let repo_version: string = '0.0.0';
  const current_version: string = GetResourceMetadata(GetCurrentResourceName(), 'version', 0);

  try {
    const versionResponse = await fetch(
      'https://raw.githubusercontent.com/Maximus7474/Maximus7474/main/data/fleecanow/version',
    );

    if (!versionResponse.ok) {
      throw new Error(`HTTP error! status: ${versionResponse.status}`);
    }

    const responseText = await versionResponse.text();
    if (responseText !== null && responseText !== '') {
      repo_version = responseText.replace(/\n/g, '');
    }
  } catch (error) {
    console.error(`^1Failed to get repository version for fleecanow:^7`, error);
    repo_version = '0.0.0';
  }

  if (repo_version !== current_version) {
    try {
      const notesResponse = await fetch(
        'https://raw.githubusercontent.com/Maximus7474/Maximus7474/main/data/fleecanow/notes',
      );

      if (!notesResponse.ok) {
        throw new Error(`HTTP error! status: ${notesResponse.status}`);
      }

      const updateNotes = await notesResponse.text();

      console.log('^6------------------------------------------------------------------------------^7');
      console.log(`^4^3mps-fleecanow^4 has a new update available (^2${current_version}^4 -> ^2${repo_version}^4):^7`);
      console.log(`^4${updateNotes}`);
      console.log('^6------------------------------------------------------------------------------^7');
    } catch (error) {
      console.error(`^1Failed to get fleecanow update notes:^7`, error);
      console.log(`^5Unable to fetch update notes at this time.^7`);
      console.log('^6------------------------------------------------------------------------------^7');
    }
  } else {
    console.log(`^2Running latest version^7`);
  }
}
