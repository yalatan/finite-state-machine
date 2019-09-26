class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if (!config) {
            throw new Error();
        }
        this.config = config;
        this.currentstate = config.initial;
        this.history = [];
        this.historyredo = [];
        this.redoable = false;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.currentstate;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        let q = 0;
        for (var key in this.config.states) {
            if (key == state) {
                q++;
            }
        }
        if (q == 0) { throw new Error() } else {
            this.history.push(state);
            this.redoable = false;
            return this.currentstate = state;
        }

    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        let state = this.config.states[this.currentstate].transitions[event];
        if (state === undefined) {
            throw new Error();
        }
        this.currentstate = state;
        this.history.push(state);
        this.redoable = false;
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.currentstate = 'normal';
        /* return this.currentstate;*/
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        let statesArray = [];
        for (var key in this.config.states) {
            for (var item in this.config.states[key].transitions) {
                if (item == event) {
                    statesArray.push(key)
                }
            }
            if (!event) { statesArray.push(key) }

        }
        return statesArray;
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (this.history.length == 0) {
            return false;
        }
        if (this.history.length == 1) {

            this.historyredo.push(this.history.pop());
            this.currentstate = 'normal';
            this.redoable = true;
            return true;
        } else {
            this.historyredo.push(this.history.pop());
            this.currentstate = this.history[this.history.length - 1];
            this.redoable = true;
            return this.currentstate;
        }

    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.redoable) { return false; }
        if (this.historyredo.length == 0) {
            return false;
        } else {
            this.history.push(this.historyredo.pop());
            this.currentstate = this.history[this.history.length - 1];
            return true;
        }

    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.history = [];
        this.historyredo = [];
    }
}

module.exports = FSM;