# Gestor de base de datos

**Realizado con electron**
## Ver tabla
```
VER tablas
VER estudiante
```

## Crear tabla 
```
CREA_TABLA estudiante (codigo,INT;nombre,VARCHAR 10)
```

## Insertar
```
INSERTA estudiante (codigo, nombre) VALORES (10, 'RENZO')
```

## Seleccionar
```
SELECCIONA * DESDE estudiante 
SELECCIONA codigo DESDE estudiante 
SELECCIONA nombre,codigo DESDE estudiante 
SELECCIONA * DESDE estudiante  DONDE codigo = 2
SELECCIONA * DESDE estudiante  DONDE codigo = 2 AND nombre ='renzo'
```

## Borrar

```
BORRA estudiantes 
BORRA estudiantes DONDE codigo = 2
BORRA estudiantes  DONDE codigo = 2 AND nombre ='renzo'
```

## Modificar
```
MODIFICA Estudiante nombre = 'Lucho' DONDE codigo = 3
MODIFICA Estudiante nombre = 'Lucho' DONDE codigo = 3 OR codigo = 4
```
