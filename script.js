const completedCourses = new Set();
const corequisiteMap = new Map();

function completeCourse(element) {
    // Si el curso está bloqueado, no hacer nada (excepto para co-requisitos)
    if (element.classList.contains('locked') && !element.classList.contains('corequisite')) {
        return;
    }
    
    const courseId = element.getAttribute('data-id');
    const coreq = element.getAttribute('data-coreq');
    
    // Manejar co-requisitos
    if (coreq && !completedCourses.has(coreq) && !element.classList.contains('completed')) {
        alert(`Debes inscribir este curso junto con ${getCourseName(coreq)}`);
        return;
    }
    
    // Alternar estado completado
    if (element.classList.contains('completed')) {
        element.classList.remove('completed');
        completedCourses.delete(courseId);
    } else {
        element.classList.add('completed');
        completedCourses.add(courseId);
    }
    
    // Actualizar estado de todos los cursos
    updateCourseStatus();
}

function getCourseName(id) {
    const course = document.querySelector(`[data-id="${id}"]`);
    return course ? course.textContent.split('\n')[0] : id;
}

function updateCourseStatus() {
    const allCourses = document.querySelectorAll('.course');
    
    allCourses.forEach(course => {
        const courseId = course.getAttribute('data-id');
        const reqs = course.getAttribute('data-reqs');
        
        // Si no tiene requisitos, es del primer semestre o electivo/optativo
        if (!reqs && !course.classList.contains('locked')) {
            course.classList.remove('locked');
            course.classList.add('unlocked');
            return;
        }
        
        // Verificar si los requisitos están cumplidos
        if (reqs) {
            const requirements = reqs.split(' ');
            const allReqsMet = requirements.every(req => completedCourses.has(req));
            
            // Actualizar estado del curso
            if (allReqsMet) {
                course.classList.remove('locked');
                course.classList.add('unlocked');
            } else {
                // Manejar excepción para co-requisitos
                if (course.classList.contains('corequisite')) {
                    const coreq = course.getAttribute('data-coreq');
                    if (coreq && completedCourses.has(coreq)) {
                        course.classList.remove('locked');
                        course.classList.add('unlocked');
                        return;
                    }
                }
                course.classList.add('locked');
                course.classList.remove('unlocked');
            }
        }
    });
}

function resetAll() {
    const allCourses = document.querySelectorAll('.course');
    allCourses.forEach(course => {
        course.classList.remove('completed');
        if (course.hasAttribute('data-reqs')) {
            course.classList.add('locked');
            course.classList.remove('unlocked');
        } else {
            course.classList.remove('locked');
            course.classList.add('unlocked');
        }
    });
    completedCourses.clear();
}

function completeAll() {
    const allCourses = document.querySelectorAll('.course');
    allCourses.forEach(course => {
        const courseId = course.getAttribute('data-id');
        course.classList.add('completed');
        completedCourses.add(courseId);
        course.classList.remove('locked');
        course.classList.add('unlocked');
    });
}

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    updateCourseStatus();
});