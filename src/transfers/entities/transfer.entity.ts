import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Player } from "src/players/entities/player.entity"
import { Team } from "src/teams/entities/team.entity"

@Entity()
export class Transfer {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @ManyToOne(() => Player)
  @ApiProperty({ type: () => Player })
  @JoinColumn({ name: 'player_id'})
  player: Player

  @ManyToOne(() => Team)
  @ApiProperty({ type: () => Team })
  @JoinColumn({ name: 'selling_team_id'})
  sellingTeam: Team

  @ManyToOne(() => Team)
  @ApiProperty({ type: () => Team })
  @JoinColumn({ name: 'buying_team_id'})
  buyingTeam: Team

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ApiProperty()
  price: number

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  @ApiProperty()
  date: Date
}

