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
SELECCIONA * DESDE estudiante  DONDE codigo = 2 AND nombre = 'renzo'
SELECCIONA * DESDE estudiante  DONDE nombre = 'RENZO'
```

## Borrar

```
BORRA estudiante 
BORRA estudiante DONDE codigo = 2
BORRA estudiante  DONDE codigo = 2 AND nombre ='renzo'
```

## Modificar
```
MODIFICA estudiante nombre = 'Lucho' DONDE codigo = 3
MODIFICA estudiante nombre = 'Lucho' DONDE codigo = 3 OR codigo = 4
```

## Clase

```
CREA_TABLA profesor (codigo,INT;nombre,VARCHAR 20)
MODIFICA profesor nombre = 'Lucho' DONDE codigo > 10 AND codigo < 20
MODIFICA profesor codigo = 1 DONDE codigo > 5000 AND codigo < 5500
SELECCIONA * DESDE profesor  DONDE codigo = 1
```
