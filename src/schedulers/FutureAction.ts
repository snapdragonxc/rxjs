import Subscription from '../Subscription';
import ImmediateScheduler from './ImmediateScheduler';
import Action from './Action';
import ImmediateAction from './ImmediateAction';

export default class FutureAction<T> extends ImmediateAction<T> {

  id: any;

  constructor(public scheduler: ImmediateScheduler,
              public work: (x?: any) => Subscription<T> | void,
              public delay: number) {
    super(scheduler, work);
  }

  schedule(state?:any): Action {
    if (this.isUnsubscribed) {
      return this;
    }
    
    this.state = state;

    const id = this.id;

    if (id != null) {
      this.id = undefined;
      clearTimeout(id);
    }

    const scheduler = this.scheduler;

    this.id = setTimeout(() => {
      this.id = void 0;
      scheduler.actions.push(this);
      scheduler.flush();
    }, this.delay);

    return this;
  }

  unsubscribe() {
    const id = this.id;
    if (id != null) {
      this.id = void 0;
      clearTimeout(id);
    }
    super.unsubscribe();
  }
}
