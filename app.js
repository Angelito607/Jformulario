const API_URL = "http://localhost:3000";

document.getElementById('formJugador').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const nombre = document.getElementById('nombre').value; 
    const equipo = document.getElementById('equipo').value; 
    const posicion = document.getElementById('posicion').value; 
    const nDorsal = document.getElementById('nDorsal').value; 
    const data = { nombre, equipo, posicion, nDorsal }; 
    
    try { 
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST', 
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) 
        }); 
        
        if (!response.ok) {
           throw new Error(`Error en la petición: ${response.status} - ${response.statusText}`); 
        } 
        const result = await response.text(); 
        alert(result); 
    } catch (error) {
      console.error('Error al enviar la petición:', error); 
      alert("Hubo un problema al registrar el jugador."); 
    } 
});
