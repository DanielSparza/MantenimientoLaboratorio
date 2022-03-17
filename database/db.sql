CREATE DATABASE mantenimientolaboratorio;
USE mantenimientolaboratorio;

CREATE TABLE rol(
    id_rol INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    rol VARCHAR(30) NOT NULL
);

CREATE TABLE users(
    id_usuario INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    usuario VARCHAR(20) NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    email VARCHAR(60) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fk_rol INT NOT NULL,
    FOREIGN KEY(fk_rol) REFERENCES rol(id_rol)
);

CREATE TABLE laboratory(
    id_laboratorio INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    descripcion VARCHAR(100)
);

CREATE TABLE computers(
    numserie VARCHAR(50) PRIMARY KEY NOT NULL,
    marca VARCHAR(50) NOT NULL,
    monitor VARCHAR(50) NOT NULL,
    memoria VARCHAR(30) NOT NULL,
    procesador VARCHAR(30) NOT NULL,
    tipoconexion VARCHAR(30) NOT NULL,
    estatus ENUM('funcionando', 'en reparacion', 'baja') NOT NULL,
    fk_laboratorio INT NOT NULL,
    FOREIGN KEY(fk_laboratorio) REFERENCES laboratory(id_laboratorio)
);

CREATE TABLE tickets(
    id_ticket INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_numserie VARCHAR(50) NOT NULL,
    fk_usuario INT NOT NULL,
    fecha timestamp NOT NULL DEFAULT current_timestamp,
    problema TEXT NOT NULL,
    FOREIGN KEY(fk_numserie) REFERENCES computers(numserie),
    FOREIGN KEY(fk_usuario) REFERENCES users(id_usuario)
);

CREATE TABLE maintenance(
    id_mantenimiento INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    fk_ticket INT NOT NULL,
    tipo ENUM('inicial', 'preventivo', 'correctivo', 'otro'),
    estatus ENUM('autorizado', 'en proceso', 'concluido', 'no autorizado'),
    observaciones TEXT,
    FOREIGN KEY(fk_ticket) REFERENCES tickets(id_ticket)
);