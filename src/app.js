import '@fortawesome/fontawesome-free/js/all';
import { Modal, Collapse } from 'bootstrap';
import CalorieTracker from './Tracker.js';
import { Meal, Workout } from './Item.js';

import './css/bootstrap.css';
import './css/style.css';





class App {
    constructor() {
        this._tracker = new CalorieTracker();
        this._loadEventListeners()
        this._tracker.loadItems()
    }
    _loadEventListeners() {
        document.getElementById('meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'))
        document.getElementById('workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'))
        document.getElementById('meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'))
        document.getElementById('workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'))
        document.getElementById('filter-meals').addEventListener('keyup', this._filterItems.bind(this, 'meal') )
        document.getElementById('filter-workouts').addEventListener('keyup', this._filterItems.bind(this, 'workout') )
        document.getElementById('reset').addEventListener('click', this._reset.bind(this));
        document.getElementById('limit-form').addEventListener('submit', this._setLimit.bind(this));
    }


    _newItem(type, e) {
    
        e.preventDefault()
    
            const name = document.getElementById(`${type}-name`);
            const calories = document.getElementById(`${type}-calories`);
    
            //Validate inputs 
            if(name.value === ' ' || calories.value === ' ') {
                alert('Please fill in all fields')
                return;
            }
            if(type === 'meal') {
                const meal = new Meal(name.value, +calories.value)
                this._tracker.addMeal(meal);

            } else {
                const workout = new Workout(name.value, +calories.value)
                this._tracker.addWorkout(workout);
            }
            
    
           //return empty and collapsed form
            name.value = '';
            calories.value = '';
            const collapseItem = document.getElementById(`collapse-${type}`)
            const bsCollapse = new Collapse(collapseItem, { toggle: true})
    
    
    }
    _removeItem(type, e) {

        if(e.target.classList.contains('delete') || e.target.classList.contains('fa-xmark')) {
            if(confirm('Are You Sure?')) {
                const mealId = e.target.closest('.card').getAttribute('data-id')
                
                 type === 'meal' 
                    ? this._tracker.removeMeal(mealId)
                    : this._tracker.removeWorkout(mealId)
                
                e.target.closest('.card').remove();
        }
    }
}
    _filterItems(type, e) {
        const text = e.target.value.toLowerCase();
        document.querySelectorAll(`#${type}-items .card`).forEach(item => {
            const name = item.firstElementChild.firstElementChild.textContent;

            if(name.toLowerCase().indexOf(text) !== -1) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        })
    } 

    _reset() {
        this._tracker.reset();

        document.getElementById('meal-items').innerHTML = '';
        document.getElementById('workout-items').innerHTML = '';
        document.getElementById('filter-meals').value = '';
        document.getElementById('filter-workouts').value = '';
        
    } 

    _setLimit(e) {
        e.preventDefault();

        const limit = document.getElementById('limit').value;
        if(limit === '') {
            alert("Please enter a value")
        }
        this._tracker.setLimit(+limit)
        const modalEl = document.getElementById('limit-modal')
        const modal =  Modal.getInstance(modalEl);
        modal.hide();

       

    }
}



const app = new App();
