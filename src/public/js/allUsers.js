const editButtons = document.querySelectorAll(".btn-edit");
const deleteButtons = document.querySelectorAll(".btn-delete");
const roleSelects = document.querySelectorAll(".role-select");

editButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    const userId = event.target.dataset.userId;
    const newRole = document.getElementById(`role-${userId}`).value;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        Swal.fire({
          title: "Listo!",
          text: "Rol actualizado con exito",
          icon: "success",
        });
      } else {
        console.error("Error al actualizar el rol del usuario:", response);
      }
    } catch (error) {
      console.error("Error al actualizar el rol del usuario:", error);
    }
  });
});

deleteButtons.forEach((button) => {
  button.addEventListener("click", async (event) => {
    const userId = event.target.dataset.userId;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        Swal.fire({
          title: "Listo!",
          text: "Usuario eliminado con exito",
          icon: "success",
        });
        const tableRow = button.parentElement.parentElement;
        tableRow.parentNode.removeChild(tableRow);
      } else {
        console.error("Error al eliminar el usuario:", response);
      }
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  });
});

roleSelects.forEach((select) => {
    select.addEventListener("change", async (event) => {
      const userId = event.target.dataset.userId;
      const newRole = event.target.value;
  
      try {
        const response = await fetch(`/usuarios/${userId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        });
  
        if (response.ok) {
            Swal.fire({
                title: "Listo!",
                text: "Rol cambiado",
                icon: "success",
              });
          const userRoleElement = document.querySelector(`#user-role-${userId}`);
          if (userRoleElement) {
            userRoleElement.textContent = newRole;
          }
        } else {
          console.error("Error al actualizar el rol del usuario:", response);
        }
      } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
      }
    });
  });