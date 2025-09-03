<?php
// Solo procesa el formulario si se envía con el método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Verifica que los datos del formulario no estén vacíos
    if (!empty($_POST['email']) && !empty($_POST['message'])) {

        // Limpia y escapa los datos
        $email = htmlspecialchars($_POST['email']);
        $message = htmlspecialchars($_POST['message']);

        // Define el nombre del archivo CSV
        // Asegúrate de que este archivo exista o tenga permisos de escritura
        $file = 'message.csv';

        // Prepara los datos a guardar en la fila
        $formData = [
            date('Y-m-d H:i:s'),
            $email,
            str_replace(["\n", "\r"], ' ', $message) // Reemplaza saltos de línea para el CSV
        ];

        // Intenta abrir el archivo en modo de adición ('a')
        $handle = fopen($file, 'a');

        // Si el archivo es nuevo, escribe los encabezados primero
        if (filesize($file) == 0) {
            fputcsv($handle, ['Fecha', 'Email', 'Mensaje']);
        }

        // Escribe los datos en una nueva fila del archivo CSV
        fputcsv($handle, $formData);

        // Cierra el archivo
        fclose($handle);

        // Envía una respuesta JSON de éxito al JavaScript
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success']);
        exit();

    } else {
        // Envía una respuesta JSON de error al JavaScript
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error']);
        exit();
    }
}
?>