import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"
import { Team } from "src/teams/entities/team.entity"

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  @ApiProperty()
  id: number

  @Column()
  @ApiProperty()
  name: string

  @Column()
  @ApiProperty()
  position: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  @ApiProperty()
  price: number

  @Column({ default: false })
  @ApiProperty()
  isOnTransferList: boolean

  @ManyToOne(
    () => Team,
    (team) => team.players,
  )
  @ApiProperty({ type: () => Team })
  team: Team
}

