# 🚀 Guía de Despliegue - Portfolio Angular

## 📋 Pasos para subir a GitHub

### 1. Preparar el repositorio
```bash
# Inicializar git si no está inicializado
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: Portfolio Angular con todas las funcionalidades"

# Conectar con el repositorio remoto
git remote add origin https://github.com/Laurentiuionica/portfolio-angular.git

# Subir al repositorio
git push -u origin main
```

### 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Ve a **Settings** > **Pages**
3. En **Source**, selecciona **Deploy from a branch**
4. Selecciona la rama **main** y la carpeta **/ (root)**
5. Haz clic en **Save**

### 3. Build y despliegue

```bash
# Hacer build del proyecto
npm run build

# La carpeta dist/portfolio-angular contiene todos los archivos para GitHub Pages
```

### 4. Subir archivos a GitHub Pages

**Opción A: Usar GitHub Actions (Recomendado)**
- El archivo `.github/workflows/deploy.yml` ya está configurado
- Solo necesitas hacer push a la rama main
- GitHub Actions se encargará del despliegue automáticamente

**Opción B: Subir manualmente**
1. Copia todo el contenido de `dist/portfolio-angular/`
2. Pégalo en la raíz de tu repositorio
3. Haz commit y push

### 5. Verificar el despliegue

Tu portfolio estará disponible en:
- **URL principal**: `https://laurentiuionica.github.io/portfolio-angular/`
- **URL alternativa**: `https://laurentiuionica.github.io/portfolio-angular/about`

## 🔧 Configuración del proyecto

### Archivos importantes:
- `angular.json` - Configuración de Angular con baseHref correcto
- `src/index.html` - HTML principal con metadatos SEO
- `src/app/app.routes.ts` - Rutas de la aplicación
- `src/app/app.routes.server.ts` - Rutas para SSR
- `README.md` - Documentación del proyecto

### Estructura de carpetas para GitHub Pages:
```
portfolio-angular/
├── index.html
├── main.*.js
├── runtime.*.js
├── styles.*.css
├── favicon.ico
└── 3rdpartylicenses.txt
```

## 🎯 Funcionalidades del Portfolio

✅ **Navegación**: Header con navegación entre secciones
✅ **Sobre Mí**: Información personal y profesional
✅ **Habilidades**: Lista de tecnologías con niveles
✅ **Portfolio**: Proyectos con filtros y enlaces
✅ **Responsive**: Diseño adaptable a todos los dispositivos
✅ **SEO**: Metadatos optimizados para motores de búsqueda
✅ **SSR**: Server-Side Rendering para mejor rendimiento

## 🚨 Solución de problemas

### Si el portfolio no se ve correctamente:
1. Verifica que el `baseHref` en `angular.json` sea `/portfolio-angular/`
2. Asegúrate de que todos los archivos estén en la raíz del repositorio
3. Verifica que GitHub Pages esté habilitado en Settings > Pages

### Si las rutas no funcionan:
1. Verifica que `src/app/app.routes.ts` tenga las rutas configuradas
2. Asegúrate de que el `baseHref` sea correcto
3. Verifica que los componentes estén exportados correctamente

## 📞 Soporte

Si tienes problemas con el despliegue, contacta:
- Email: ionica2802@gmail.com
- LinkedIn: [Laurentiu Ionica](https://www.linkedin.com/in/laurentiu-ionica-659210384)

---

¡Tu portfolio estará listo para impresionar a los reclutadores! 🎉
