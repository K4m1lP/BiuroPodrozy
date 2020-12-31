import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataServiceService } from '../data-service/data-service.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.css']
})
export class TripDetailsComponent implements OnInit {
  routeSub: string | undefined;
  currTrip: any;
  booked = 0;
  constructor(private route: ActivatedRoute, private data: DataServiceService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.routeSub = params.id;
    });
    if (this.routeSub === undefined ){
      this.router.navigate(['/listOfTrips']).then(r => r);
    } else {
      this.data.getList().pipe(
        map(changes =>
          changes.map((c: { payload: { key: any; val: () => any; }; }) => {
            return ({key: c.payload.key, ...c.payload.val()}); }
          ).filter( (c: any) => c.key === this.routeSub)
            .map((c: any) => {
              return c;
            }))
      ).subscribe(list => {
        if (list[0] === undefined){
          this.router.navigate(['/listOfTrips']).then(r => r);
        }
        this.booked = list[0].booked;
        this.currTrip = list;
      } );
    }
  }
  book(): void{
    if (this.routeSub != null) {
      this.data.update(this.routeSub, {booked: (this.booked + 1)});
    }
  }
  cancel(): void{
    if (this.routeSub != null) {
      this.data.update(this.routeSub, {booked: (this.booked - 1)});
    }
  }
  delete(): void{
    if (this.routeSub != null) {
      this.data.remove(this.routeSub);
      this.router.navigate(['/listOfTrips']).then(r => r);
    }
  }

}